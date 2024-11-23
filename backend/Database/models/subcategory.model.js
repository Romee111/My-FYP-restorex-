import { Schema, model } from "mongoose";
import { NotificationModel } from "./notification.model.js";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [2, "Too Short"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: Schema.ObjectId,
      required: true,
      ref: "category",
    },
  },
  { timestamps: true }
);

// Post-hook to create notification
subCategorySchema.post("save", async function (doc) {
  try {
    await NotificationModel.create({
      recipient: null,
      message: `A new subcategory "${doc.name}" has been added.`,
      type: "created",
    });
    console.log("Notification created for new subcategory.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
});

export const subCategoryModel = model("subcategory", subCategorySchema);
