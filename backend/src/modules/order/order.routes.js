import express from "express";
// import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as order from     "./order.controller.js"
const orderRouter = express.Router();

//  orderRouter
//  .route("/getAccessToken")
//  .post(
//    order.getAccessToken
//  )

 orderRouter
  .route("/createOrder")
  .post(
    protectedRoutes,
    allowedTo("user"),
   order.createOrder
  )

//  orderRouter
//   .route("/processPayment")
//   .post(
//     protectedRoutes,
//     allowedTo("user"),
//     order.processPayment
//   )

//   orderRouter
//   .route("/paymentWebhook")
//   .post(
//     protectedRoutes,
//     allowedTo("user","admin","seller"),
//     order.paymentWebhook
//   )

//   orderRouter
//   .route("/paymentCallback")
//   .get(
//     protectedRoutes,
//     allowedTo("user","admin","seller"),
//     order.paymentCallback
//   )

  orderRouter
  .route("/getAllOrders")
  .get(
    protectedRoutes,
    allowedTo("user","admin","seller"),
    order.getAllOrders
  )

  orderRouter
  .route("/getOrderById/:id")
  .get(
    protectedRoutes,
    allowedTo("user","admin","seller"),
    order.getOrderById
  )
  orderRouter
  .route("/cancelOrder/:id")
  .put(
    protectedRoutes,
    allowedTo("user","admin","seller"),
    order.cancelOrder
  )

  orderRouter
  .route("/getOrdersForSeller/:id")
  .get(
    protectedRoutes,
    allowedTo("seller"),
    order.getOrdersForSeller
  )
  orderRouter
  .route("/getCustomersBySellerId/:id")
  .get(
    protectedRoutes,
    allowedTo("seller"),
    order.getCustomersBySellerId
  )

  orderRouter
  .route("/updateOrderTracking/:id")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    order.updateOrderTracking
  )
    
  orderRouter
  .route("/getOrderTracking/:id")
  .get(
    protectedRoutes,
    allowedTo("user","admin","seller"),
    order.getOrderTracking
  )
  orderRouter
  .post("/returnOrder/:id", 
    order.returnOrder)
  // orderRouter
  // .route("/validatePayment/:token")
  // .get(
  //   protectedRoutes,
  //   allowedTo("user","admin","seller"),
  //   order.validatePayment
    
  // )

  export default  orderRouter

  




























// orderRouter
//   .route("/createOrder")
//   .post(
//     protectedRoutes,
 
//     order.createOrder
//   )

// orderRouter
//   .route("/getOrders")
//   .get(
//     // protectedRoutes,
//     // allowedTo("user", "admin", "seller"),
//     order.getOrders
//   )

//   orderRouter
//   .route("/getSingleOrder/:id")
//   .get(
//     protectedRoutes,
//     allowedTo("user"),
//     order.getSingleOrder
//   )
// orderRouter
//   .route("/updateOrder/:id")
//   .put(
//     protectedRoutes,
//     allowedTo("user"),
//     order.updateOrder
//   )

// orderRouter
//   .route("/deleteOrder/:id")
//   .delete(
//     protectedRoutes,
//     allowedTo("user"),
//     order.cancelOrder
//   )

