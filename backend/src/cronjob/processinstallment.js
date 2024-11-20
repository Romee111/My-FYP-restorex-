import cron from 'node-cron';
import { OrderModel } from '../../Database/models/order.model.js';
import nodemailer from 'nodemailer';

// Configure nodemailer for email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email provider
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your password
  },
});

// Cron job to check overdue installments and send reminders
cron.schedule('0 9 * * *', async () => { // Runs every day at 9:00 AM
  try {
    console.log('Running cron job to send installment reminders');

    // Fetch orders with pending installments that are overdue
    const orders = await OrderModel.find({
      'Installments.status': 'pending',
      'Installments.dueDate': { $lte: new Date() },
    }).populate('userId'); // Populate user data if necessary

    for (const order of orders) {
      const userEmail = order.userId.email; // Assuming user has an `email` field
      const overdueInstallments = order.Installments.filter(
        (installment) => installment.status === 'pending' && installment.dueDate <= new Date()
      );

      // Send email notification to the user
      if (userEmail && overdueInstallments.length > 0) {
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: userEmail,
          subject: 'Installment Payment Reminder',
          html: `
            <p>Dear ${order.userId.name},</p>
            <p>You have overdue installment payments for your order.</p>
            <p>Details:</p>
            <ul>
              ${overdueInstallments
                .map(
                  (installment) => `
                  <li>Installment #${installment.installmentNumber} - Amount: $${installment.amount} - Due Date: ${new Date(
                    installment.dueDate
                  ).toLocaleDateString()}</li>
                `
                )
                .join('')}
            </ul>
            <p>Please make your payments as soon as possible.</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent to ${userEmail}`);
      }
    }

    console.log('Cron job completed');
  } catch (error) {
    console.error('Error running cron job:', error.message);
  }
});
