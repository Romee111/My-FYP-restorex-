//import axios from "axios";
import { OrderModel } from "../../../Database/models/order.model.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { productModel } from "../../../Database/models/product.model.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import userModel from "../../../Database/models/user.model.js";
const stripe = new Stripe(
  `sk_test_51QMs3Z2NEZLb2kYBwKbWNuoIsRWfNflKxVjEsWVOssJWH2qHaMmQneCcnIDXzCFqfVsb20Gm9Q4giQWFSUl5Fh1g00JRSGevUl`
); // Replace with your Stripe key

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// const getExchangeRate = async () => {
//   const response = await fetch(
//     "https://api.exchangerate-api.com/v4/latest/USD"
//   );
//   const data = await response.json();
//   return data.rates.PKR;
// };
// const totalAmountInPKR = Math.round(totalAmount * exchangeRate * 100);
//  // Convert totalAmount to PKR

// const exchangeRate = await getExchangeRate(); // Fetch the real-time exchange rate

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      payment,
      delivered,
    } = req.body;

    // Validate that the required fields are present
    if (
      !userId ||
      !cartId ||
      !shippingAddress ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the cart items using the cartId
    const cart = await cartModel
      .findById(cartId)
      .populate("cartItem.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the order has already been paid or delivered
    const existingOrder = await OrderModel.findOne({ userId, cartId });
    if (existingOrder && (existingOrder.isPaid || existingOrder.isDelivered)) {
      return res.status(400).json({
        message:
          "Order has already been paid or delivered. No further actions allowed.",
      });
    }

    // Extract products from cart and prepare order products
    const products = cart.cartItem.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      title: item.title,
      color: item.color,
      size: item.size,
      price: item.price,
      totalProductDiscount: item.totalProductDiscount,
    }));

    const orderData = {
      userId,
      cartId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      products,
    };

    // Handle payment logic only if payment hasn't been marked as 'success' already
    if (payment === "success") {
      orderData.isPaid = true;
    }

    // Handle delivery logic only if it hasn't been marked as 'success' already
    if (delivered === "success") {
      orderData.isDelivered = true;
      orderData.deliveredAt = new Date(); // Set the delivery date
    }

    // If payment is not 'success' and not already delivered, proceed to payment
    if (payment !== "success" && !delivered) {
      // Process payment (e.g., using Stripe or another payment provider)
      const totalAmountInPKR = Math.round(totalAmount * 286 * 100); // Assuming USD to PKR conversion rate
      const lineItems = [
        {
          price_data: {
            currency: "pkr",
            product_data: { name: "Order Payment" },
            unit_amount: totalAmountInPKR,
          },
          quantity: 1,
        },
      ];

      const clientSuccessUrl = `${process.env.FRONTEND_ORIGIN}//user/checkout/success`;
      const clientCancelUrl = `${process.env.FRONTEND_ORIGIN}/user/checkout/cancel`;

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${clientSuccessUrl}?check_success=payment&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientCancelUrl}?check_cancel=payment`,
      });

      // Save the payment URL in the order data
      orderData.paymentURL = checkoutSession.url;
    }

    // Save order in the database
    const newOrder = new OrderModel(orderData);
    const savedOrder = await newOrder.save();

    // Send order confirmation email
    const user = await userModel.findById(userId); // Get user details
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Order Confirmation",
      text: `Hi ${user.name},\n\nThank you for your order. Your order ID is ${savedOrder._id}.\nTotal Amount: $${totalAmount}\n\nRegards,\nYour Store Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Handle payment success if payment === "success"
    if (payment === "success") {
      savedOrder.isPaid = true; // Mark the order as paid
      await savedOrder.save();

      // Send payment success notification to the user
      const paymentSuccessMessage = `Your payment for order ID ${savedOrder._id} was successful. Your order will be processed shortly.`;
      const paymentNotification = new NotificationModel({
        recipient: userId, // The user who made the order
        message: paymentSuccessMessage,
        type: "order",
        read: false,
      });

      await paymentNotification.save();
    }

    // Handle order delivery if delivered === "success"
    if (delivered === "success") {
      savedOrder.isDelivered = true; // Mark the order as delivered
      savedOrder.deliveredAt = new Date(); // Set the delivery date
      await savedOrder.save();

      // Send order delivery notification to the user
      const deliverySuccessMessage = `Your order ID ${savedOrder._id} has been successfully delivered.`;
      const deliveryNotification = new NotificationModel({
        recipient: userId, // The user who placed the order
        message: deliverySuccessMessage,
        type: "order",
        read: false,
      });

      await deliveryNotification.save();
    }

    // Optionally clear the cart
    await cartModel.deleteOne({ _id: cartId });

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
      paymentURL: orderData.paymentURL,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartId,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//       CNIC,
//       installmentMonths,
//     } = req.body;

//     if (
//       !userId ||
//       !cartId ||
//       !shippingAddress ||
//       !paymentMethod ||
//       !totalAmount
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (paymentMethod === "installment" && totalAmount < 30000) {
//       return res.status(400).json({
//         message:
//           "Installment payment is only available for orders above 30,000.",
//       });
//     }

//     const orderData = {
//       userId,
//       cartId,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//     };

//     let paymentURL = null;

//     if (paymentMethod === "installment") {
//       if (!CNIC) {
//         return res.status(400).json({
//           message: "CNIC is required for installment payment.",
//         });
//       }
//       orderData.CNIC = CNIC;

//       const validInstallmentPlans = [3, 6];
//       if (!validInstallmentPlans.includes(installmentMonths)) {
//         return res.status(400).json({
//           message: "Installment plan must be either 3 or 6 months.",
//         });
//       }

//       const installmentAmount = totalAmount / installmentMonths;
//       const installmentDueDates = Array.from(
//         { length: installmentMonths },
//         (_, i) => {
//           const dueDate = new Date();
//           dueDate.setMonth(dueDate.getMonth() + i + 1);
//           return {
//             installmentNumber: i + 1,
//             amount: installmentAmount,
//             dueDate,
//             paymentURL: `https://your-payment-gateway.com/pay/installment/${
//               i + 1
//             }`,
//           };
//         }
//       );

//       orderData.Installments = installmentDueDates;
//       paymentURL = installmentDueDates[0].paymentURL;
//     }

//     if (paymentMethod === "card") {
//       const lineItems = [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: "Order Payment" },
//             unit_amount: Math.round(totalAmount * 100),
//           },
//           quantity: 1,
//         },
//       ];

//       const clientSuccessUrl = "http://localhost:3000/success";
//       const clientCancelUrl = "http://localhost:3000/cancel";

//       const checkoutSession = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         mode: "payment",
//         line_items: lineItems,
//         success_url: `${clientSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: clientCancelUrl,
//       });

//       paymentURL = checkoutSession.url;

//       orderData.paymentIntentId = checkoutSession.payment_intent;
//       orderData.paymentURL = paymentURL;

//       return res.status(201).json({
//         message: "Payment initiated, complete payment to place the order",
//         paymentURL,
//       });
//     }

//     // Payment completed, save order
//     const newOrder = new OrderModel(orderData);
//     const savedOrder = await newOrder.save();

//     // Send confirmation email
//     const user = await UserModel.findById(userId); // Assuming you have a UserModel
//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: user.email,
//       subject: "Order Confirmation",
//       text: `Hi ${user.name},\n\nThank you for your order. Your order ID is ${savedOrder._id}.\n\nTotal Amount: $${totalAmount}\n\nRegards,\nYour Store Team`,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error("Error sending email:", err);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     });

//     res.status(201).json({
//       message: "Order created successfully and confirmation email sent",
//       order: savedOrder,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

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
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};
// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    let orders;

    // Check the role of the user
    if (req.user.role === "user") {
      // If the user is a normal user, retrieve orders for the logged-in user
      orders = await OrderModel.find({ userId: req.user.id })
        .populate("userId")
        .populate("cartId");
    } else if (req.user.role === "admin") {
      // If the user is an admin, retrieve all orders
      orders = await OrderModel.find().populate("userId").populate("cartId");
    } else {
      return res.status(403).json({ message: "Unauthorized" }); // Unauthorized access
    }

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving orders", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error retrieving order", error: error.message });
  }
};

export const getOrdersForSeller = async (req, res) => {
  // Check if the user is a seller
  if (req?.user?.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Access denied. You are not a seller." });
  }

  const sellerId = req.user._id;

  try {
    // Find orders where products in the cart were created by the seller
    const orders = await OrderModel.find({
      "cartId.products.createdBy": sellerId,
    })
      .populate({
        path: "cartId",
        populate: {
          path: "products", // Assuming `products` is an array of references in the cart schema
          model: "Product", // Ensure the correct model is used
        },
      })
      .populate("userId"); // Populate customer details for each order

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }

    res.status(200).json({
      message: "Orders retrieved successfully for the seller",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving seller orders:", error.message);
    res.status(500).json({
      message: "Error retrieving seller orders",
      error: error.message,
    });
  }
};

export const getCustomersBySeller = catchAsyncError(async (req, res, next) => {
  // Check if the user is a seller
  if (req?.user?.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Access denied. You are not a seller." });
  }

  const sellerId = req.user._id;

  try {
    // Step 1: Find all products created by the seller
    const products = await productModel.find({ createdBy: sellerId });
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }

    // Extract product IDs
    const productIds = products.map((product) => product._id);

    // Step 2: Find orders containing these products
    const orders = await OrderModel.find({
      "cartId.products.productId": { $in: productIds }, // Match products created by the seller
    }).populate("userId"); // Populate customer details for each order

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found for this seller's products" });
    }

    // Step 3: Extract unique customer details
    const customers = orders.map((order) => order.userId);
    const uniqueCustomers = Array.from(
      new Set(customers.map((c) => c._id.toString()))
    ).map((id) => customers.find((c) => c._id.toString() === id));

    // Step 4: Send response
    res.status(200).json({
      message: "success",
      customers: uniqueCustomers,
    });
  } catch (error) {
    console.error("Error retrieving customers by seller:", error.message);
    res.status(500).json({
      message: "Error retrieving customers by seller",
      error: error.message,
    });
  }
});

export async function updateOrderTracking(req, res) {
  try {
    const { orderId, status, location } = req.body;

    // Validate status
    const validStatuses = ['created', 'shipped', 'in_transit', 'delivered', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the order by ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the tracking information
    order.tracking.status = status;
    order.tracking.location = location || order.tracking.location; // Location is optional
    order.tracking.updatedAt = new Date(); // Update timestamp

    // Save the updated order
    await order.save();

    return res.status(200).json({
      message: 'Order tracking updated successfully',
      tracking: order.tracking,
    });
  } catch (error) {
    console.error('Error updating order tracking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export  async function getOrderTracking(req, res) {
  try {
    const { orderId } = req.params;

    // Find the order by ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      orderId: order._id,
      tracking: order.tracking,
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function returnOrder(req, res) {
  try {
    const { orderId } = req.body;

    // Find the order by ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order is already returned
    if (order.isReturned) {
      return res.status(400).json({ message: 'Order has already been returned' });
    }

    // Set the order as returned and set the return requested flag
    order.isReturned = true;
    order.returnRequested = true;
    order.returnDate = new Date();  // Set the return date

    // Save the updated order
    await order.save();

    return res.status(200).json({
      message: 'Return request successful',
      order: order,
    });
  } catch (error) {
    console.error('Error processing return:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}