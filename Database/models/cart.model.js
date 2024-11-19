import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: "user",
    },
    cartItem:[Object],
    totalPrice:Number,
    totalPriceAfterDiscount:Number,
    discount:Number
  },
  {
    timestamps: true,
  }
);

export let cartModel = model("cart", cartSchema);
