import express from "express";
import * as wallet from "./wallet.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
const walletRouter = express.Router();


    walletRouter
    .route("/checkBalance/:Id")
    .get(
        protectedRoutes,
        allowedTo("user"),
        wallet.checkBalance);

    walletRouter
    .route("/addFunds/:Id")
    .post(
        protectedRoutes,
        allowedTo("user"),
        wallet.addFunds);

    walletRouter
    .route("/makePayment/:Id")
    .post(
        protectedRoutes,
        allowedTo("user"),
        wallet.makePayment);

    walletRouter
    .route("/getTransactionHistory/:Id")
    .get(
        protectedRoutes,
        allowedTo("user"),
        wallet.getTransactionHistory);

    walletRouter
    .route("/returnPayment/:Id")
    .post(
        protectedRoutes,
        allowedTo("user"),
        wallet.returnPayment);

export default walletRouter