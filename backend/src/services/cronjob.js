import cron from 'node-cron';
import { OrderModel } from '../../Database/models/order.model.js';
import { sendInstallmentReminder } from '../utils/emailsender.js'; // Assuming the sendReminder.js file is created for sending reminders

// Cron job to send monthly reminders
cron.schedule('0 0 1 * *', async () => { // Runs at midnight on the first day of each month
  const orders = await OrderModel.find({ "Installments.status": "pending" }).populate('userId'); // Populate user info for email
  const today = new Date();

  for (const order of orders) {
    for (const installment of order.Installments) {
      if (installment.status === 'pending' && installment.dueDate <= today) {
        await sendInstallmentReminder(order.userId.email, installment); // Send reminder
      }
    }
  }
});
