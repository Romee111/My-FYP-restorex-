import  {Schema, model} from  "mongoose";

const emailSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientEmail: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentAt: { type: Date, default: Date.now },
  error: { type: String }, // Optional: store error details if the email failed
});

export const EmailModel = model('Email', emailSchema);
