import nodemailer from 'nodemailer';
import { EmailModel } from './../../../Database/models/email.model.js';
import { NotificationModel } from './../../../Database/models/notification.model.js';

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send Email Function
const sendEmail = async (req, res) => {
  try {
    const { recipientEmail, recipientId, subject, message } = req.body;

    // Send the email using Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text: message,
    });

    // Save email in database (optional)
    const email = new EmailModel({
      recipientId,
      recipientEmail,
      subject,
      message,
      status: 'sent', // Or 'failed' if something went wrong
      sentAt: new Date(),
    });
    await email.save();

    // Create a notification for the recipient
    const notification = new NotificationModel({
      recipient: recipientId,
      message: `You have received a new email: ${subject}`,
      type: 'email',
      createdAt: new Date(),
    });
    await notification.save();

    res.status(200).json({ success: true, message: 'Email sent and logged successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);

    // Save the failed email attempt
    const failedEmail = new EmailModel({
      recipientId: req.body.recipientId,
      recipientEmail: req.body.recipientEmail,
      subject: req.body.subject,
      message: req.body.message,
      status: 'failed',
      sentAt: new Date(),
      error: error.message,
    });
    await failedEmail.save();

    res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
  }
};

// Retrieve Email History
const getEmailHistory = async (req, res) => {
  try {
    const { recipientId } = req.params;

    const emails = await EmailModel.find({ recipientId }).sort({ sentAt: -1 });
    res.status(200).json({ success: true, emails });
  } catch (error) {
    console.error('Error retrieving email history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch email history.', error: error.message });
  }
};

// Retry Failed Emails
const retryFailedEmails = async (req, res) => {
  try {
    const failedEmails = await EmailModel.find({ status: 'failed' });

    for (const email of failedEmails) {
      try {
        // Resend the email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email.recipientEmail,
          subject: email.subject,
          text: email.message,
        });

        // Update the status to 'sent'
        email.status = 'sent';
        await email.save();
      } catch (error) {
        console.error(`Failed to resend email to ${email.recipientEmail}:`, error);
      }
    }

    res.status(200).json({ success: true, message: 'Retry process completed.' });
  } catch (error) {
    console.error('Error retrying failed emails:', error);
    res.status(500).json({ success: false, message: 'Failed to retry emails.', error: error.message });
  }
};

const deleteEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    await EmailModel.findByIdAndDelete(emailId);
    res.status(200).json({ success: true, message: 'Email deleted successfully.' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ success: false, message: 'Failed to delete email.', error: error.message });
  }
};

export {
  sendEmail,
  getEmailHistory,
  retryFailedEmails,
  deleteEmail
};
