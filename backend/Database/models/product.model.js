import mongoose, { Schema, model } from "mongoose";
import { NotificationModel } from "./notification.model.js";

const productSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [3, "Too Short product Name"],
    },
    imgCover: {
      type: String,
    },
    images: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalProductDiscount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    color: {
      type: [String],
    },
    size: {
      type: [String],
    },
    description: {
      type: String,
      maxlength: [400, "Description should be less than or equal to 400"],
      minlength: [10, "Description should be more than or equal to 10"],
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
    },
    brands: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    imagesArray: [
      {
        images: { type: String },
        sizes: { type: [String] },
        colors: { type: [String] },
        price: { type: Number },
        quantity: { type: Number },
      },
    ],
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        username: { type: String },
        rating: { type: Number, required: true },
        reviewText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre(["find", "findOne"], function () {
  this.populate("reviews");
});

// Post-hook to create notification
productSchema.post("save", async function (doc) {
  try {
    await NotificationModel.create({
      recipient: doc.createdBy,
      message: `A new product "${doc.title}" has been created.`,
      type: "created",
    });
    console.log("Notification created for new product.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
});

export const productModel = model("product", productSchema);
