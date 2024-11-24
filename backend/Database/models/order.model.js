import mongoose, { Schema, model } from "mongoose";
const trackingSchema = new Schema({
  status: {
    type: String,
    enum: ['created', 'shipped', 'in_transit', 'delivered', 'returned'],
    default: 'created', // initial order status
  },
  location: {
    type: String,
    default: 'Not available',
  },
  updatedAt: { type: Date, default: Date.now },
});
const installmentSchema = new Schema({
  installmentNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentURL: { type: String }  // Optional, could be used for each installment payment
});

const orderSchema = new Schema({
  userId: { type: Schema.ObjectId, required: true, ref: "user" },
  products: [
    {
      productId: { type: Schema.ObjectId, ref: "Product" }, // Reference to product
      quantity: { type: Number, required: true }, // Optional: To track quantity
      title: { type: String },
      color: { type: String },
      size: { type: String },
      price: { type: String },
      totalProductDiscount: { type: String },
    },
  ],
  shippingAddress: {
    street: String,
    address: String,
    zipCode: String,
    city: String,
    phone: Number
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'installment'],
    default: 'cash'
  },
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  Installments: [installmentSchema],
  CNIC: {
    type: String,
    required: function () {
      return this.paymentMethod === "installment";
    },
  },
  paidAt: Date,
  deliveredAt: Date,
});

 export const OrderModel = mongoose.model('Order', orderSchema);


