// import { userModel } from "../../../Database/models/user.model.js";
// import { AppError } from "../../utils/AppError.js";
// import { catchAsyncError } from "../../utils/catchAsyncError.js";
// import jwt from "jsonwebtoken"; 
// import bcrypt from "bcrypt";

// const signUp = catchAsyncError(async (req, res, next) => {
//   // console.log(req.body.email);
//   let isUserExist = await userModel.findOne({ email: req.body.email });
//   if (isUserExist) {
//     return next(new AppError("Account is already exist!", 409));
//   }
//   const user = new userModel(req.body);
//   await user.save();

//   let token = jwt.sign(
//     { email: user.email, name: user.name, id: user._id, role: user.role },
//     "JR"
//   );
//   res.status(201).json({ message: "success", user, token });
// });

// const signIn = catchAsyncError(async (req, res, next) => {
//   const { email, password } = req.body;
//   let user = await userModel.findOne({ email });
//   if (!user || !bcrypt.compareSync(password, user.password)) {
//     return next(new AppError("Invalid email or password", 401));
//   }
//   let token = jwt.sign(
//     { email: user.email, name: user.name, id: user._id, role: user.role },
//     "JR"
//   );
//   res.status(201).json({ message: "success", token });
// });

// const protectedRoutes = catchAsyncError(async (req, res, next) => {
//   const { token } = req.headers;
//   if (!token) return next(new AppError("Token was not provided!", 401));

//   let decoded = await jwt.verify(token, "JR");

//   // console.log(decoded);
//   // console.log(decoded.iat);

//   let user = await userModel.findById(decoded.id);
//   if (!user) return next(new AppError("Invalid user", 404));
//   // console.log(user);
//   // console.log(user.passwordChangedAt);

//   if (user.passwordChangedAt) {
//     let passwordChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000);
//     if (passwordChangedAt > decoded.iat)
//       return next(new AppError("Invalid token", 401));
//   }
//   // console.log(decoded.iat, "-------------->",passwordChangedAt);

//   req.user = user;
//   next();
// });

// const allowedTo = (...roles) => {
//   return catchAsyncError(async (req, res, next) => {
//     if (!roles.includes(req.user.role))
//       return next(
//         new AppError(
//           `You are not authorized to access this route. Your are ${req.user.role}`,
//           401
//         )
//       );
//     next();
//   });
// };
// export { signUp, signIn, protectedRoutes, allowedTo };

import userModel  from "../../../Database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";


const signUp = catchAsyncError(async (req, res, next) => {
  // console.log(req.body.email);
  let isUserExist = await userModel.findOne({ email: req.body.email });
  if (isUserExist) {
    return next(new AppError("Account is already exist!", 409));
  }
  console.log(req.body);
  
  const user = new userModel(req.body);
  await user.save();

  let token = jwt.sign(
    { email: user.email, name: user.name, id: user._id, role: user.role },
    "JR"
  );
  await sendSignupEmail(req.body.email, user._id);
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
    { email: user.email, name: user.name, id: user._id, role: user.role },
    "JR"
  );
  res.status(201).json({ message: "success", token , user});
});

const protectedRoutes = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization; // Typically 'Authorization' header is used
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token was not provided!", 401));
  }
  
  const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
  let decoded;
  try {
    decoded = jwt.verify(token, "JR"); // Verify the token
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
  
  let user = await userModel.findById(decoded.id);
  if (!user) return next(new AppError("Invalid user", 404));
  
  if (user.passwordChangedAt) {
    let passwordChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (passwordChangedAt > decoded.iat)
      return next(new AppError("Invalid token", 401));
  }

  req.user = user;
  next();
});


const allowedTo = (...roles) => {
  return catchAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "You are not authorized to access this route. Your are ${req.user.role}",
          401
        )
      );
    next();
  });
};
const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  // 1. Check if the user exists
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("No user found with that email address", 404));

  // 2. Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3. Hash the token and set expiration time
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

  // 4. Save user data (skip validation for performance)
  await user.save({ validateBeforeSave: false });

  // 5. Create a password reset link
  const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;

  // 6. Email message
  const message = `You requested to reset your password. Please click the following link to reset it: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`;

  try {
    // 7. Send the email
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (Valid for 10 minutes)",
      message,
    });

    // 8. Send success response
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // Handle email errors
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email. Try again later.", 500));
  }
});


const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return next(new AppError("Please provide both password fields", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Hash the token to match the stored one
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user by the hashed token and check if the token has not expired
  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // Ensure token is still valid
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // Update the user's password
  const salt = await bcrypt.genSalt(12); // Adjust salt rounds as needed
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined; // Clear reset token
  user.resetPasswordExpires = undefined; // Clear expiration time
  await user.save();

  res.status(200).json({
    message: "Password has been reset successfully",
  });
});


export { signUp, signIn, protectedRoutes, allowedTo, forgetPassword, resetPassword };