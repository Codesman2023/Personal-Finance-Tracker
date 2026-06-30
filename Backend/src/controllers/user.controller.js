const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const crypto = require("crypto");
const { sendOtpEmail, sendWelcomeEmail, sendForgotPasswordEmail } = require("../services/email.service");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser?.isVerified) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user =
    existingUser ||
    (await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    }));

  if (existingUser) {
    user.fullname.firstname = fullname.firstname;
    user.fullname.lastname = fullname.lastname;
    user.password = hashedPassword;
  }

  try {
    const otp = await user.generateOtp();
    await sendOtpEmail(user.email, otp);
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
    return res.status(500).json({
      message:
        "Account was created, but the OTP email could not be sent. Please try resending the OTP.",
    });
  }

  res.status(201).json({
    message:
      "Registration successful. Please verify the OTP sent to your email.",
    email: user.email,
  });
};

module.exports.verifyOtp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;
  const user = await userModel.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res
      .status(400)
      .json({ message: "Account is already verified. Please login." });
  }

  const isValidOtp = await user.verifyOtp(otp);
  if (!isValidOtp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = user.generateAuthToken();
  res.status(200).json({ token, user });

  sendWelcomeEmail(user.email, user.fullname.firstname).catch((error) => {
    console.error("Failed to send welcome email:", error.message);
  });
};

module.exports.resendOtp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Account is already verified" });
  }

  try {
    const otp = await user.generateOtp();
    await sendOtpEmail(user.email, otp);
  } catch (error) {
    console.error("Failed to resend OTP email:", error.message);
    return res.status(500).json({
      message: "Unable to resend OTP email. Please try again later.",
    });
  }

  res.status(200).json({ message: "A new OTP has been sent to your email" });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your email before logging in" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

module.exports.updateBudgetSettings = async (req, res) => {
  const monthlyBudgetLimit = Number(req.body.monthlyBudgetLimit);

  if (!Number.isFinite(monthlyBudgetLimit) || monthlyBudgetLimit < 0) {
    return res
      .status(400)
      .json({ message: "Monthly budget must be a positive number." });
  }

  const user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { monthlyBudgetLimit },
      { new: true, runValidators: true },
    )
    .select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "Budget settings updated.",
    monthlyBudgetLimit: user.monthlyBudgetLimit,
  });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  await sendForgotPasswordEmail(user.email, resetLink);

  res.status(200).json({
    message: "If that email exists, a reset link has been sent.",
  });
};

module.exports.resetPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if(!user){
      return res.status(400).json({ message: "Invalid or expired reset link"});
    }

    user.password = await userModel.hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    
    res.status(200).json({ message: "Password has been reset successfully."});
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};
