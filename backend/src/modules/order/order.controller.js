import axios from "axios";
import { OrderModel } from "../../../Database/models/order.model.js";
import { cartModel } from "../../../Database/models/cart.model.js";

const BSECURE_BASE_URL = process.env.BSECURE_BASE_URL;
const CLIENT_ID = process.env.BSECURE_CLIENT_ID;
const CLIENT_SECRET = process.env.BSECURE_CLIENT_SECRET;

// // Helper: Get Access Token
// const getAccessToken = async () => {
//   try {
//     const response = await axios.post( BSECURE_BASE_URL, {
//       grant_type: "client_credentials",
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//     });

//     if (response.data && response.data.access_token) {
//       return response.data.access_token;
//     } else {
//       throw new Error("Failed to generate access token");
//     }
//   } catch (error) {
//     console.error("Error generating access token:", error.response?.data || error.message);
//     throw new Error("bSecure authentication failed");
//   }
// };
// const getAccessToken = async () => {
//   try {
//     // Making the request to bSecure's token endpoint
//     const response = await axios.post(
//       BSECURE_BASE_URL,
//       new URLSearchParams({
//         grant_type: "client_credentials",  // OAuth 2.0 Client Credentials flow
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",  // Ensure proper content type for OAuth
//         },
//       }
//     );

//     // Check if the token is in the response
//     if (response.data && response.data.access_token) {
//       console.log('Access Token:', response.data.access_token);
//       return response.data.access_token;  // Return the access token
//     } else {
//       throw new Error('Failed to generate access token');
//     }
//   } catch (error) {
//     console.error("Error generating access token:", error.response?.data || error.message);
//     throw new Error('bSecure authentication failed');
//   }
// };

// Example usage
// getAccessToken()
//   .then((token) => {
//     // You can use the token for further requests
//     console.log("Successfully received access token:", token);
//   })
//   .catch((error) => {
//     console.error("Failed to retrieve token:", error.message);
//   });

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      ${process.env.API_BASE_URL}/v1/oauth/token,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data && response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error("Failed to generate access token");
    }
  } catch (error) {
    console.error("Error generating access token:", error.response?.data || error.message);
    throw new Error("Authentication failed");
  }
}


// // Helper: Validate Payment via API
export const validatePayment = async (transactionId) => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${BSECURE_BASE_URL}/payments/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Returns the validated payment details
  } catch (error) {
    console.error("Error validating payment:", error.response?.data || error.message);
    throw new Error("Payment validation failed");
  }
};

// 1. Process Payment
export const processPayment = async (req, res) => {
  const { cartId, paymentMethod, cnic, shippingAddress } = req.body;

  try {
    // Fetch cart and user details, now populating productId as well
    const cart = await cartModel.findById(cartId).populate('cartItem.productId').populate('userId').lean();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const customer = {
      name: cart.userId.name,
      email: cart.userId.email,
      phone_number: cart.userId.phoneNumber,
    };

    // Calculate totalAmount first before proceeding
    let totalAmount = 0;
    totalAmount = cart.cartItem.reduce((sum, item) => {
      const price = item.productId?.price || 0;  // Fallback to 0 if price is missing
      const quantity = item.quantity || 0;     // Fallback to 0 if quantity is missing

      // Log item details for debugging
      console.log("Item:", item);
      console.log("Item Price:", price, "Item Quantity:", quantity);

      // Check if price or quantity is invalid
      if (typeof price !== "number" || typeof quantity !== "number" || price <= 0 || quantity <= 0) {
        console.error("Invalid price or quantity detected:", item);
        return sum; // Skip this item and continue with the next
      }

      return sum + price * quantity;
    }, 0);

    // Log totalAmount for debugging
    console.log("Total Amount:", totalAmount);

    // Check if totalAmount is valid
    // if (isNaN(totalAmount) || totalAmount <= 0) {
    //   throw new Error("Invalid totalAmount calculated");
    // }

    // Now that totalAmount is calculated, create the order
    const newOrder = new OrderModel({
      userId: cart.userId._id,
      cartId: cart._id,
      shippingAddress,
      paymentMethod,
      totalAmount,
      ...(paymentMethod === "installment" && { CNIC: cnic }),
      Installments: paymentMethod === "installment" ? generateInstallments(totalAmount) : [],
    });

    await newOrder.save();

    // Prepare payment payload
    const payload = {
      order_id: newOrder._id.toString(),
      amount: newOrder.totalAmount, // Ensure we're using the initialized totalAmount
      currency: "PKR",
      customer,
      items: cart.cartItem.map((item) => ({
        name: item.productId.name,
        unit_price: item.productId.price,
        quantity: item.quantity,
      })),
      payment: {
        method: paymentMethod,
        ...(paymentMethod === "installment" && { cnic }),
      },
    };

    // Initialize payment
    const token = await getAccessToken();
    console.log("Access Token:", token); // Log token for debugging
    const response = await axios.post(`${BSECURE_BASE_URL}/payments`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.redirect_url) {
      res.status(200).json({
        message: "Payment initialized successfully",
        orderId: newOrder._id,
        redirectUrl: response.data.redirect_url, // Redirect to payment gateway
      });
    } else {
      throw new Error("Failed to initialize payment");
    }
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Payment processing failed", error: error.message });
  }
};


// 2. Payment Webhook
export const paymentWebhook = async (req, res) => {
  const { order_id, transaction_id, status } = req.body;

  try {
    const order = await OrderModel.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "success") {
      order.paymentStatus = "paid";
      order.transactionId = transaction_id;
    } else {
      order.paymentStatus = "failed";
    }

    await order.save();
    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};

// 3. Redirect Callback
export const paymentCallback = async (req, res) => {
  const { order_id, status, transaction_id } = req.query;

  try {
    const order = await OrderModel.findById(order_id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "success") {
      order.paymentStatus = "paid";
      order.transactionId = transaction_id;
    } else {
      order.paymentStatus = "failed";
    }

    await order.save();

    // Redirect to a user-friendly status page
    res.redirect(`/payment-status?orderId=${order_id}&status=${status}`);
  } catch (error) {
    console.error("Error processing callback:", error.message);
    res.status(500).json({ message: "Callback processing failed" });
  }
};

// Helper: Generate Installments
 const generateInstallments = (totalAmount) => {
  const numInstallments = 6;
  const installmentAmount = totalAmount / numInstallments;

  return Array.from({ length: numInstallments }, (_, index) => ({
    installmentNumber: index + 1,
    amount: Math.ceil(installmentAmount),
    dueDate: new Date(Date.now() + index * 30 * 24 * 60 * 60 * 1000),
    status: "pending",
  }));
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
