import nodemailer from 'nodemailer';
import userModel  from '../../Database/models/user.model.js';  // Assuming the user model is stored in 'models/user.model.js'

export const notifySellerStatus = async (email, status) => {
  try {
    // Validate that the required fields are present
    if (!email || !status) {
      throw new Error("Email and status are required");
    }

    // Check if the user exists
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("No user found with this email");
    }

    // Configure the email message based on the status
    let subject, message;
    switch (status) {
      case "approved":
        subject = "Seller Account Approved";
        message = `<h1>Your seller account has been approved!</h1>
                   <p>You can now access seller features on the platform.</p>`;
        break;
      case "unapproved":
        subject = "Seller Account Not Approved";
        message = `<h1>Your seller account approval was unsuccessful.</h1>
                   <p>Please contact support for further information.</p>`;
        break;
      case "deleted":
        subject = "Seller Account Deleted";
        message = `<h1>Your seller account has been deleted.</h1>
                   <p>If you have questions, please reach out to support.</p>`;
        break;
      case "updated":
        subject = "Seller Account Updated";
        message = `<h1>Your seller account information has been updated.</h1>
                   <p>Review your account details to confirm the changes.</p>`;
        break;
      default:
        throw new Error("Invalid status provided");
    }

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: subject,
      html: message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error("Error sending email");
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};



export async function sendInstallmentReminder(userEmail, installment) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: `Installment Reminder - Due Payment`,
    text: `Dear Customer,

    This is a reminder that your installment payment of ${installment.amount} is due on ${installment.dueDate}. 

    Please make the payment at your earliest convenience to avoid any late fees.

    Regards,
    The Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Installment reminder email sent successfully!');
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
}
export const sendSignupEmail = async (email, userId) => {
  try {
    if (!email || !userId) {
      throw new Error("Email and User ID are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("No user found with this email");
    }

    // Generate a login link or an account activation link
    const loginLink = `https://ecommerce-react-ten-pi.vercel.app/signin`;

    const subject = "Welcome to Our Platform!";
    const message = `<h1>Thank you for signing up!</h1>
                     <p>Your account has been created successfully. Please click the link below to log in:</p>
                     <p><a href="${loginLink}">Click here to log in</a></p>`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject,
      html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error("Error sending email");
      } else {
        console.log('Signup confirmation email sent: ' + info.response);
      }
    });
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
}