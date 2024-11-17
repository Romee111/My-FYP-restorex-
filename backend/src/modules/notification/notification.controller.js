import nodemailer from 'nodemailer';
import { NotificationModel } from './../../../Database/models/notification.model.js';
import { EmailModel } from './../../../Database/models/email.model.js';

const sendNotificationWithEmail = async (req, res) => {
  try {
    const { recipientId, recipientEmail, subject, message } = req.body;

    // Step 1: Save Email in the database (for history)
    const email = new EmailModel({
      recipientId,
      recipientEmail,
      subject,
      message,
    });
    await email.save();

    // Step 2: Create an In-App Notification
    const notification = new NotificationModel({
      recipient: recipientId, // Ensure you use 'recipient' as per the schema
      message: `You have a new email: "${subject}"`,
      type: 'email',
    });
    await notification.save();

    // Step 3: Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Adjust based on your provider
      auth: {
        user: process.env.EMAIL_USERNAME, // Set in .env
        pass: process.env.EMAIL_PASSWORD, // Set in .env
      },
    });

    // Step 4: Email Options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recipientEmail,
      subject,
      text: message,
    };

    // Step 5: Send Email
    await transporter.sendMail(mailOptions);

    // Update the email status to 'sent' after sending successfully
    await EmailModel.findByIdAndUpdate(email._id, { status: 'sent' });

    res.status(200).send({ success: true, message: 'Email and notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification or email:', error);

    // If the email fails, update the status to 'failed' and store the error
    const { recipientId, recipientEmail, subject, message } = req.body;
    const email = new EmailModel({
      recipientId,
      recipientEmail,
      subject,
      message,
      status: 'failed',
      error: error.message,
    });
    await email.save();

    res.status(500).send({ success: false, message: 'Failed to send notification or email.' });
  }
};

const getUnreadNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await NotificationModel.find({ recipient: userId, read: false }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch unread notifications.' });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    await NotificationModel.findByIdAndUpdate(notificationId, { read: true });
    res.status(200).send({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send({ success: false, message: 'Failed to mark notification as read.' });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch notifications.' });
  }
};

const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    await NotificationModel.findByIdAndDelete(notificationId);
    res.status(200).send({ success: true, message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send({ success: false, message: 'Failed to delete notification.' });
  }
};

export {
  sendNotificationWithEmail,
  getUnreadNotifications,
  markNotificationAsRead,
  getAllNotifications,
  deleteNotification,
};
