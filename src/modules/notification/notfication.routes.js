
import expreess from "express";
import * as notificationController from "./notification.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";
import { allowedTo } from "../auth/auth.controller.js";

const notificationRouter = expreess.Router();

notificationRouter
.route("/sendNotificationWithEmail")
.post(
    protectedRoutes,
    allowedTo("user","Admin","seller"),
    notificationController.sendNotificationWithEmail
)

notificationRouter
    .route("/getUnreadNotification/:id")
    .get(
        protectedRoutes,
        allowedTo("user","Admin","seller"),
        notificationController.getUnreadNotifications 
    )

notificationRouter
    .route("/markNotificationAsRead/:id")
    .put(
        protectedRoutes,
        allowedTo("user","Admin","seller"),
        notificationController.markNotificationAsRead
    )
notificationRouter
    .route("/getAllNotifications")
    .get(
        protectedRoutes,
        allowedTo("Admin"),
        notificationController.getAllNotifications
    )

notificationRouter
    .route("/deleteNotification/:id")
    .delete(
        protectedRoutes,
        allowedTo("Admin","user","seller"),
        notificationController.deleteNotification
    )    

    

export default notificationRouter