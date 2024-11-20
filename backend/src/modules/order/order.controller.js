  




//import axios from "axios";
import { OrderModel } from "../../../Database/models/order.model.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";
const stripe = new Stripe(`sk_test_51QMs3Z2NEZLb2kYBwKbWNuoIsRWfNflKxVjEsWVOssJWH2qHaMmQneCcnIDXzCFqfVsb20Gm9Q4giQWFSUl5Fh1g00JRSGevUl`); // Replace with your Stripe key

const transporter = nodemailer.createTransport({
   host:" smtp.gmail.com " ,
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
});

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      CNIC,
      installmentMonths,
    } = req.body;

    if (!userId || !cartId || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (paymentMethod === "installment" && totalAmount < 30000) {
      return res.status(400).json({
        message: "Installment payment is only available for orders above 30,000.",
      });
    }

    const orderData = {
      userId,
      cartId,
      shippingAddress,
      paymentMethod,
      totalAmount,
    };

    let paymentURL = null;

    if (paymentMethod === "installment") {
      if (!CNIC) {
        return res.status(400).json({
          message: "CNIC is required for installment payment.",
        });
      }
      orderData.CNIC = CNIC;

      const validInstallmentPlans = [3, 6];
      if (!validInstallmentPlans.includes(installmentMonths)) {
        return res.status(400).json({
          message: "Installment plan must be either 3 or 6 months.",
        });
      }

      const installmentAmount = totalAmount / installmentMonths;
      const installmentDueDates = Array.from(
        { length: installmentMonths },
        (_, i) => {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i + 1);
          return {
            installmentNumber: i + 1,
            amount: installmentAmount,
            dueDate,
            paymentURL: `https://your-payment-gateway.com/pay/installment/${i + 1}`,
          };
        }
      );

      orderData.Installments = installmentDueDates;
      paymentURL = installmentDueDates[0].paymentURL;
    }

    if (paymentMethod === "card") {
      const lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Order Payment" },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ];

      const clientSuccessUrl = "http://localhost:3000/success";
      const clientCancelUrl = "http://localhost:3000/cancel";

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${clientSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: clientCancelUrl,
      });

      paymentURL = checkoutSession.url;

      orderData.paymentIntentId = checkoutSession.payment_intent;
      orderData.paymentURL = paymentURL;

      return res.status(201).json({
        message: "Payment initiated, complete payment to place the order",
        paymentURL,
      });
    }

    // Payment completed, save order
    const newOrder = new OrderModel(orderData);
    const savedOrder = await newOrder.save();

    // Send confirmation email
    const user = await UserModel.findById(userId); // Assuming you have a UserModel
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Order Confirmation",
      text: `Hi ${user.name},\n\nThank you for your order. Your order ID is ${savedOrder._id}.\n\nTotal Amount: $${totalAmount}\n\nRegards,\nYour Store Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Order created successfully and confirmation email sent",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrdersForSeller = async (req, res) => {
  const { sellerId } = req.params;  // Extract the sellerId from request parameters

  try {
    // Find orders where the products in the cart have a createdBy field matching the sellerId
    const orders = await OrderModel.find({
      'cartId.products.createdBy': sellerId,  // Ensure 'products.createdBy' matches the sellerId
    }).populate('cartId');  // Optional: populate cartId if you want to retrieve cart details along with the order

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this seller" });
    }

    res.status(200).json({
      message: "Orders retrieved successfully for the seller",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving seller orders:", error.message);
    res.status(500).json({ message: "Error retrieving seller orders", error: error.message });
  }
};


export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Cannot cancel a paid order" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("userId").populate("cartId");

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error.message);
    res.status(500).json({ message: "Error retrieving orders", error: error.message });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId)
      .populate("userId")
      .populate("cartId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    console.error("Error retrieving order:", error.message);
    res.status(500).json({ message: "Error retrieving order", error: error.message });
  }
};
