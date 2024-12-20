import userModel from "../../../Database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { sendSignupEmail } from "../../utils/emailsender.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Request from "../../../Database/models/request.model.js";

const signUp = catchAsyncError(async (req, res, next) => {
  // Check if the email already exists
  let isUserExist = await userModel.findOne({ email: req.body.email });
  if (isUserExist) {
    return next(new AppError("Account already exists!", 409));
  }

  // Create a new user
  const user = new userModel(req.body);
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { email: user.email, name: user.name, id: user._id, role: user.role },
    "JR",
    { expiresIn: "1h" }
  );

  // Send signup email to the user
  await sendSignupEmail(req.body.email, user._id);

  // If the user is a seller, create an unapproved request
  if (user.role === "seller") {
    const newRequest = new Request({
      sellerId: user._id,
      requestType: "signup",
      requestDetails: `New seller "${user.name}" has registered with email "${user.email}".`,
      status: "pending",
    });

    // Save the request to the database
    await newRequest.save();
    console.log("New seller signup request created.");
  }

  // Respond to the client
  res.status(201).json({ message: "success", user, token });
});

const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("================");
  let user = await userModel.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new AppError("Invalid email or password", 401));
  }
  console.log("================");

  let token = jwt.sign(
    { email: user.email, name: user.name, id: user._id, role: user?.role },
    "JR",
    { expiresIn: "1h" }
  );
  res.status(201).json({ message: "success", token, user });
});
const protectedRoutes = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization; // Typically 'Authorization' header is used
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token was not provided!", 401));
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, "JR"); // Verify the token
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token has expired", 401)); // Handle token expiration
    }
    return next(new AppError("Invalid token", 401)); // Handle other token errors
  }

  let user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("Invalid user", 404));
  }

  if (user.passwordChangedAt) {
    const passwordChangedAt = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedAt > decoded.iat) {
      return next(
        new AppError("Invalid token - Password changed after token issued", 401)
      );
    }
  }

  req.user = user; // Attach user to the request object for further use
  next();
});

const allowedTo = (...roles) => {
  return catchAsyncError(async (req, res, next) => {
    if (!roles.some((role) => role?.toLowerCase().includes(req?.user?.role)))
      return next(
        new AppError(
          "You are not authorized to access this route. Your are ${req.user.role}",
          401
        )
      );
    next();
  });
};
// const forgetPassword = catchAsyncError(async (req, res, next) => {
//   const { email } = req.body;

//   // 1. Check if the user exists
//   const user = await userModel.findOne({ email });
//   if (!user) return next(new AppError("No user found with that email address", 404));

//   // 2. Generate a reset token
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   // 3. Hash the token and set expiration time
//   user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//   user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

//   // 4. Save user data (skip validation for performance)
//   await user.save({ validateBeforeSave: false });

//   // 5. Create a password reset link
//   const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;

//   // 6. Email message
//   const message = `You requested to reset your password. Please click the following link to reset it: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`;

//   try {
//     // 7. Send the email
//     await sendEmail({
//       email: user.email,
//       subject: "Your Password Reset Token (Valid for 10 minutes)",
//       message,
//     });

//     // 8. Send success response
//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email!",
//     });
//   } catch (err) {
//     // Handle email errors
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(new AppError("There was an error sending the email. Try again later.", 500));
//   }
// });

const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  // 1. Check if the user exists
  const user = await userModel.findOne({ email }); // Use 'userModel' here
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "No email found",
    });
  }

  // 2. Generate a token
  const forgetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10m", // Optional: Token expires in 10 minutes
  });

  // 3. Configure nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // 4. Define the email options
  const resetLink = `http://localhost:2900/userauth/resetPassword/${forgetToken}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email, // Use the user from the query
    subject: "Forget Password",
    html: `<h1>Forget Password</h1>
           <p>Click on this <a href="${resetLink}">link</a> to reset your password.</p>`,
  };

  // 5. Send the email
  await transporter.sendMail(mailOptions);

  res.status(200).json({
    status: "success",
    message: "Email has been sent",
    data: {
      forgetToken,
    },
  });
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  // Extract token from the Authorization header
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "Token must be provided",
    });
  }

  // Verify the reset token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user by ID from the decoded token
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10); // Generate a salt
  user.password = await bcrypt.hash(req.body.password, salt); // Use the salt to hash the password

  // Save the new password to the user
  await user.save();

  // Send success response
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

export {
  signUp,
  signIn,
  protectedRoutes,
  allowedTo,
  forgetPassword,
  resetPassword,
};
