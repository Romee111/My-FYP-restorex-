
import express from "express";
import * as email from "../../modules/email/email.controller.js";
import { allowedTo, protectedRoutes } from "../../modules/auth/auth.controller.js";
const emailRouter = express.Router();

emailRouter
    .route("/sendEmail")
    .post(
        protectedRoutes,
        allowedTo("user","Admin","seller"),
        email.sendEmail
    )

emailRouter
    .route("/getEmailHistory/:id")
    .get(
        protectedRoutes,
        allowedTo("user","Admin","seller"),
        email.getEmailHistory
    )

emailRouter
    .route("/retryFailedEmails")
    .post(
        protectedRoutes,
        allowedTo("user","Admin","seller"),
        email.retryFailedEmails
    )

emailRouter
    .route("/deleteEmail/:id")
    .delete(
        protectedRoutes,
        allowedTo("user","Admin","seller"),
        email.deleteEmail
    )


export default emailRouter