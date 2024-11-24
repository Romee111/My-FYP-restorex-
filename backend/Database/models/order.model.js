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
       userId: { type: Schema.ObjectId, required: true, ref: 'user' },
       cartId: { type: Schema.ObjectId, required: true, ref: 'cart' }, 
     shippingAddress: {
    street: String,
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
  CNIC: { type: String, required: function() { return this.paymentMethod === 'installment'; } },
  paidAt: Date,
  isReturned: { type: Boolean, default: false },
  returnDate: Date,
  returnRequested: { type: Boolean, default: false },
  deliveredAt: Date,
  tracking: trackingSchema
});

 export const OrderModel = mongoose.model('Order', orderSchema);


