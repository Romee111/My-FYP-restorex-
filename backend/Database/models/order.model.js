import mongoose, { Schema, model } from "mongoose";

const installmentSchema = new Schema({
  installmentNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentURL: { type: String }  // Optional, could be used for each installment payment
});

const orderSchema = new Schema({
  userId: { type: Schema.ObjectId, required: true, ref: 'user' },
  

//     productId: { type: Schema.ObjectId, required: true, ref: 'product' },
//     quantity: { type: Number, required: true },

//  } ],
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
  deliveredAt: Date,
});

 export const OrderModel = mongoose.model('Order', orderSchema);


