import express from "express";
// import { validate } from "../../middlewares/validate.js";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as order from     "./order.controller.js"
const orderRouter = express.Router();

orderRouter
  .route("/createOrder")
  .post(
    protectedRoutes,
    allowedTo("user"),
    order.createOrder
  )

orderRouter
  .route("/getOrders")
  .get(
    // protectedRoutes,
    // allowedTo("user", "admin", "seller"),
    order.getOrders
  )

  orderRouter
  .route("/getSingleOrder/:id")
  .get(
    protectedRoutes,
    allowedTo("user"),
    order.getSingleOrder
  )
orderRouter
  .route("/updateOrder/:id")
  .put(
    protectedRoutes,
    allowedTo("user"),
    order.updateOrder
  )

orderRouter
  .route("/deleteOrder/:id")
  .delete(
    protectedRoutes,
    allowedTo("user"),
    order.cancelOrder
  )

export default orderRouter;
