// import cron from 'node-cron';
// import { orderModel } from '../../Database/models/order.model.js';
// import { processInstallmentPayment } from '../services/paymentProcessor.js';

// // Run cron job daily at midnight
// cron.schedule('0 0 * * *', async () => {
//   console.log("Running scheduled task to process due installments...");

//   const today = new Date();
//   try {
//     // Fetch orders with due installments for today or earlier
//     const orders = await orderModel.find({
//       "Installments.dueDate": { $lte: today },
//       "Installments.status": "pending"
//     });

//     for (const order of orders) {
//       for (const installment of order.Installments) {
//         if (installment.dueDate <= today && installment.status === 'pending') {
//           // Process payment for the installment
//           const paymentSuccess = await processInstallmentPayment(installment, order.userId);

//           if (paymentSuccess) {
//             installment.status = 'paid';
//           } else {
//             console.log(`Payment failed for installment #${installment.installmentNumber}`);
//           }
//         }
//       }
//       await order.save();
//     }
//   } catch (error) {
//     console.error("Error processing due installments:", error);
//   }
// });
