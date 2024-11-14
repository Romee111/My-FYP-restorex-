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
    description: {
      type: String,
      maxlength: [100, "Description should be less than or equal to 100"],
      minlength: [10, "Description should be more than or equal to 10"],
      required: true,
      trim: true,
    },
    category:{
       type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
    },
    subcategory:{
       type: mongoose.Schema.Types.ObjectId,
    ref: 'subcategory'

    }
    // other fields...
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Middleware to format image URLs
// productSchema.post("init", function (doc) {
//   // Format imgCover if it's not an external URL
//   if (doc.imgCover && !doc.imgCover.startsWith("http")) {
//     doc.imgCover = `${process.env.BASE_URL}products/${doc.imgCover}`;
//   }

//   // Format each image in images if they're not external URLs
//   if (doc.images && Array.isArray(doc.images)) {
//     doc.images = doc.images.map((ele) =>
//       ele.startsWith("http") ? ele : `${process.env.BASE_URL}products/${ele}`
//     );
//   }
// });

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
