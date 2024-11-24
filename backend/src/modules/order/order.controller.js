//import axios from "axios";
import { OrderModel } from "../../../Database/models/order.model.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { productModel } from "../../../Database/models/product.model.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import userModel from "../../../Database/models/user.model.js";
import { NotificationModel } from "../../../Database/models/notification.model.js";
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

    console.log(req.body);

    // Case 1: Payment is 'success' and delivery is not 'success'
    if (payment === "success" && delivered !== "success") {
      // Only update isPaid to true and send related notifications
      // const existingOrder = await OrderModel.findOne({ userId });

      const updatedOrder = await OrderModel.findOneAndUpdate(
        { userId }, // Filter
        { isPaid: true, paidAt: new Date() }, // Update
        { new: true } // Return the updated document
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      console.log(updatedOrder.isPaid);

      // Send order confirmation email
      // const user = await userModel.findById(userId);
      // const mailOptions = {
      //   from: process.env.EMAIL,
      //   to: user.email,
      //   subject: "Payment Confirmation",
      //   text: `Hi ${user.name},\n\nYour payment for order ID ${updatedOrder._id} was successful. We will process your order shortly.\n\nRegards,\nYour Store Team`,
      // };

      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     console.error("Error sending email:", err);
      //   } else {
      //     console.log("Email sent:", info.response);
      //   }
      // });

      // Create notification for payment success
      const paymentSuccessMessage = `Your payment for order ID ${updatedOrder._id} was successful. Your order will be processed shortly.`;
      const paymentNotification = new NotificationModel({
        recipient: userId,
        message: paymentSuccessMessage,
        type: "order",
        read: false,
      });

      await paymentNotification.save();

      return res.status(200).json({
        message: "Payment successful and order updated",
        order: updatedOrder,
      });
    }

    // Case 2: Payment is not 'success' and delivery is 'success'
    if (payment !== "success" && delivered === "success") {
      // Only update isDelivered to true and send related notifications
      const existingOrder = await OrderModel.findOne({ userId, orderId });
      if (!existingOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the delivery status and set the delivery date
      existingOrder.isDelivered = true;
      existingOrder.deliveredAt = new Date(); // Set the delivery date

      // Optionally, mark fields explicitly as modified if necessary
      existingOrder.markModified("isDelivered");
      existingOrder.markModified("deliveredAt");

      // Save the updated order
      await existingOrder.save();

      // Send delivery confirmation email
      const user = await userModel.findById(userId);
      // const mailOptions = {
      //   from: process.env.EMAIL,
      //   to: user.email,
      //   subject: "Order Delivered",
      //   text: `Hi ${user.name},\n\nYour order ID ${existingOrder._id} has been successfully delivered.\n\nRegards,\nYour Store Team`,
      // };

      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     console.error("Error sending email:", err);
      //   } else {
      //     console.log("Email sent:", info.response);
      //   }
      // });

      // Create notification for delivery success
      const deliverySuccessMessage = `Your order ID ${existingOrder._id} has been successfully delivered.`;
      const deliveryNotification = new NotificationModel({
        recipient: userId,
        message: deliverySuccessMessage,
        type: "order",
        read: false,
      });

      await deliveryNotification.save();

      return res.status(200).json({
        message: "Order delivered successfully and updated",
        order: existingOrder,
      });
    }

    // Case 3: Payment is not 'success' and delivery is not 'success'
    if (payment !== "success" && delivered !== "success") {
      // Check if the order already exists
      const existingOrder = await OrderModel.findOne({ userId, cartId });
      if (existingOrder) {
        return res.status(400).json({
          message: "Order already placed. Please check your order status.",
        });
      }

      // Fetch the cart items using the cartId
      const cart = await cartModel
        .findById(cartId)
        .populate("cartItem.productId");
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Extract products from cart and prepare order products
      const products = cart?.cartItem?.map((item) => ({
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

      // Create order and generate payment link if payment is not 'success'
      const totalAmountInPKR = Math.round(totalAmount * 100);

      if (totalAmountInPKR > 99999999) {
        return res.status(400).json({
          message:
            "The order amount is too large. Please reduce the cart size.",
        });
      }

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

      // Save order in the database
      const newOrder = new OrderModel(orderData);
      const savedOrder = await newOrder.save();

      const clientSuccessUrl = `${process.env.FRONTEND_ORIGIN}/user/checkout/success`;
      const clientCancelUrl = `${process.env.FRONTEND_ORIGIN}/user/checkout/cancel`;

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${clientSuccessUrl}?check_success=payment&orderId=${savedOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientCancelUrl}?check_cancel=payment&orderId=${savedOrder._id}`,
      });

      // Save payment URL in the order data
      orderData.paymentURL = checkoutSession.url;

      return res.status(201).json({
        message: "Order created successfully",
        order: savedOrder,
        paymentURL: checkoutSession.url,
      });
    }
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
      orders = await OrderModel.find({ userId: req.user.id }).populate(
        "userId"
      );
      // .populate("cartId");
    } else if (req.user.role === "admin") {
      // If the user is an admin, retrieve all orders
      orders = await OrderModel.find().populate("userId");
      // .populate("cartId");
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
