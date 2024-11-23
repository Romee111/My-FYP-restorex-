import { Schema, model } from "mongoose";
import { NotificationModel } from "./notification.model.js";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [4, "Too Short"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    Image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Post-hook to create notification
categorySchema.post("save", async function (doc) {
  try {
    await NotificationModel.create({
      recipient: null,
      message: `A new category "${doc.name}" has been added.`,
      type: "created",
    });
    console.log("Notification created for new category.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
});

export const categoryModel = model("category", categorySchema);
