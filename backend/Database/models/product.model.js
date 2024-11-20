import mongoose, { Schema, model } from "mongoose";

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

    imagesArray: {
      imageURL: [String],
      ImageColor: [String],
      ImageSize: [String],

    }

    // other fields...
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


// Virtual for reviews
productSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "productId",
});

// Pre-hook for populating reviews on find operations
productSchema.pre(["find", "findOne"], function () {
  this.populate("reviews");
});

export const productModel = model("product", productSchema);
