import { cartModel } from '../../../Database/models/cart.model.js';
import { productModel } from '../../../Database/models/product.model.js';
import { OrderModel } from '../../../Database/models/order.model.js';
import nodemailer from 'nodemailer';
import { get } from 'mongoose';


export async function createOrder(req, res) {
  const {cartId, shippingAddress, paymentMethod, totalAmount, CNIC, installmentPeriod, userEmail} = req.body

  // Fetch the cart data using the cartI
  
  const cartData = await cartModel.findOne({_id: cartId });
  console.log(cartData,"cartdata");
  

  if (!cartData) {
    res.json("Cart not found.");
  }

  const userId = cartData.userId; // Extract userId from the cart data
  const productIds = cartData.cartItem.map(item => item.productId); // Extract product IDs from cart items

  // Ensure the cart's totalAmount matches the incoming totalAmount
  // if (cartData.totalPrice !== totalAmount) {
  //   res.json("Total amount mismatch.");
  // }  temporary
console.log(productIds,"productIds Array")
  // Fetch the product data for cart items
  const products = await productModel.find({ _id: { $in: productIds } });
console.log(products,"products")
  if (products.length !== cartData.cartItem.length) {
    res.json("One or more products not found.");
  }

  let newOrder;

  if (paymentMethod === 'card' || paymentMethod === 'cash') {
// Map cart items to include each product's payment_URL
const orderItems = cartData.cartItem.map(item => {
  const product = products.find(product => product._id.toString() === item.productId.toString());
  return {
    productId: item.productId,
    quantity: item.quantity,
    payment_URL: product.payment_URL // Use the product's payment_URL
  };
});

console.log(orderItems,"orderItems")

newOrder = new OrderModel({
  userId,  // userId is extracted from cartData
  cartId,  // cartId is stored as a reference
  //  orderItems,
  shippingAddress,
  paymentMethod,
  totalAmount,
  isPaid: false,
  isDelivered: false
})

await newOrder.save()
    console.log(newOrder, "newOrder Created");

    const emailSent = await sendOrderConfirmationEmail(userEmail, newOrder);
    if (emailSent) {
      return res.json({
        message: "Order Placed Successfully",
        order: newOrder,
        paymentRedirectURL: cartData.cartItem[0].payment_URL
      });
    } else {
      return res.json({ message: "Order placed, but error sending email." });
    }
  }

  // Handle installment payment method
  if (paymentMethod === 'installment') {
    if (totalAmount < 30000) {
      res.json("Installments are only available for orders over 30,000.");
    }

    if (!CNIC) {
      res.json("CNIC is required for installment payments.");
    }

    let installments = [];
    let installmentAmount = totalAmount / installmentPeriod;

    for (let i = 1; i <= installmentPeriod; i++) {
      let dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        installmentNumber: i,
        amount: installmentAmount,
        dueDate: dueDate,
        payment_URL: products[0].payment_URL // Use the product's payment_URL for each installment
      });
    }
  
      
    newOrder = new OrderModel({
      userId,  // userId is extracted from cartData
      cartId,  // cartId is stored as a reference
      shippingAddress,
      paymentMethod,
      totalAmount,
      CNIC,
      Installments: installments,
      isPaid: false,
      isDelivered: false
    });


    await newOrder.save();

    const emailSent = await sendOrderConfirmationEmail(userEmail, newOrder);
    if (emailSent) {
      return res.json({
        message: "Order Placed Successfully",
        order: newOrder,
        paymentRedirectURL: installments[0].payment_URL
      });
    } else {
      return res.json({ message: "Order placed, but error sending email." });
    }
  }

  res.json("Invalid payment method.");
}



// Function to send order confirmation email
// Function to send order confirmation email
async function sendOrderConfirmationEmail(userEmail, order) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const cartItems = await cartModel.findById(order.cartId).lean().exec();
  let orderDetails = '';

  for (let item of cartItems.cartItem) {
    const totalAmount = item.quantity * order.totalAmount;
    orderDetails += `${item.quantity} x ${item.productId} (Total: ${totalAmount})\n`;
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Order Confirmation - Your Order has been Placed',
    text: `Dear Customer,

    Your order has been successfully placed! Here are your order details:
    
    Order ID: ${order._id}
    Payment Method: ${order.paymentMethod}
    Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.phone}
    
    Items:
    ${orderDetails}
    
    Total Amount: ${order.totalAmount}
    
    Thank you for shopping with us! Your order will be processed soon.

    Regards,
    The Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function  getOrders(req, res) {
  const orders = await OrderModel.find().populate('userId');
  res.json(orders);
}
   export async function getSingleOrder(req, res) {
    const { id } = req.params;
    const order = await OrderModel.findById(id).populate('userId').populate('cartId').populate('Installments.productId');
    res.status(201).json(
      {
        message: "success",
        order: order
      }
    )
  }


  export async function cancelOrder(req, res) {
    const { id } = req.params;
    const order = await OrderModel.findByIdAndDelete(id);
    res.json(order);
  }
   export async  function updateOrder(req, res) {
    const { id } = req.params;
    const order = await OrderModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json(order);
  }

  