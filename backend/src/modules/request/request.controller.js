// controllers/request.controller.js
import Request from "../../../Database/models/request.model.js";
import userModel from "../../../Database/models/user.model.js";
import { notifySellerStatus } from "../../utils/emailsender.js"; // Import the notify function

export const getAllRequests = async (req, res, next) => {
  try {
    const getAllRequests = await Request.find().populate(
      "sellerId",
      "name email"
    ); // Populates seller's name and email
    res.status(200).json({ message: "success", getAllRequests });
  } catch (error) {
    next(error);
  }
};

export const createRequest = async (req, res, next) => {
  try {
    const { requestType, requestDetails } = req.body;
    const sellerId = req.user._id; // Assuming the seller is authenticated and their ID is stored in the session or JWT
    // Validate required fields
    if (!requestType || !requestDetails) {
      return res.status(400).json({
        status: "fail",
        message: "Request type and details are required.",
      });
    }

    // Create a new request document
    const newRequest = new Request({
      sellerId,
      requestType,
      requestDetails,
      status: "pending", // Default status when the request is created
    });

    // Save the request to the database
    await newRequest.save();

    // Send success response
    res.status(201).json({
      status: "success",
      message: "Request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const respondToRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // Request ID from the URL
    const { status, response } = req.body; // Status and response message from the admin

    // Find and update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { status, response },
      { new: true }
    ).populate("sellerId");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If the request type is "signup" and the status is "approved", update the seller_approved field
    console.log({
      type: updatedRequest.requestType,
      status: updatedRequest.status,
    });

    if (
      updatedRequest.requestType === "signup" &&
      updatedRequest.status === "approved"
    ) {
      await userModel.updateOne(
        { _id: updatedRequest.sellerId._id, role: "seller" },
        {
          seller_approved: true,
          seller_status: "approved",
        }
      );
      console.log(`Seller "${updatedRequest.sellerId._id}" approved successfully.`);
    } else if (
      updatedRequest.requestType === "signup" &&
      updatedRequest.status === "rejected"
    ) {
      await userModel.updateOne(
        { _id: updatedRequest.sellerId._id, role: "seller" },
        {
          seller_approved: false,
          seller_status: "rejected",
        }
      );
      console.log(`Seller "${updatedRequest.sellerId._id}" rejected successfully.`);
    }
    

    // Optionally send an email to notify the seller of the request status
    await notifySellerStatus(updatedRequest.sellerId.email, status);

    // Return success response
    res.status(200).json({
      message: "Request status updated, and seller approved if applicable",
      request: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const pendingRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ status: "pending" }).populate(
      "sellerId"
    );
    res.status(200).json({ message: "Success", requests });
  } catch (error) {
    next(error);
  }
};
