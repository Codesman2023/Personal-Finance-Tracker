const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('fullname.firstname').notEmpty().withMessage('First name is required.'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required.')
],
    userController.registerUser
);

router.post('/verify-otp', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.')
],
    userController.verifyOtp
);

router.post('/resend-otp', [
    body('email').isEmail().withMessage('Please enter a valid email address.')
],
    userController.resendOtp
);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.')
],
    userController.loginUser
);

router.get('/dashboard', authMiddleware.authUser, userController.getUserProfile);

router.put('/budget', authMiddleware.authUser, userController.updateBudgetSettings);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please enter a valid email address.")],
  userController.forgotPassword
);

router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")],
  userController.resetPassword
);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;
