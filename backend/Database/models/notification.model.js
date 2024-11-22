import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User" }, // Admin or Seller
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["email", "order", "support", "created"],
    default: "email",
  }, // Type of notification
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = model("Notification", notificationSchema);
