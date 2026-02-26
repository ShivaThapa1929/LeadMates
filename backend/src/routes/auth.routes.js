const express = require('express');
const router = express.Router();
const {
    signup, login, refreshToken, getMe, logout, updateAvatar,
    verifyOtp, resendOtp, forgotPassword, resetPassword, verifyLogin2FA
} = require('../controllers/auth.controller');
const { signupValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, resendOtpValidation } = require('../validations/auth.validation');
const { validate, protect } = require('../middlewares/auth.middleware');
const { otpRateLimiter, verificationRateLimiter, resendOtpLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload.middleware');

/**
 * @desc    Signup Route
 */
router.post('/signup', otpRateLimiter, signupValidation, validate, signup);

/**
 * @desc    Login Route
 */
router.post('/login', otpRateLimiter, loginValidation, validate, login);
router.post('/verify-login-2fa', verificationRateLimiter, verifyLogin2FA);

/**
 * @desc    OTP Management Routes (Mobile/Email)
 */
router.post('/verify-otp', verificationRateLimiter, verifyOtp);
router.post('/resend-otp', resendOtpLimiter, resendOtpValidation, validate, resendOtp);

/**
 * @desc    Request OTP (for login if needed later, or initial verification trigger)
 */
// router.post('/request-otp', requestOtp); 

/**
 * @desc    Refresh Token Route
 */
router.post('/refresh-token', refreshToken);

/**
 * @desc    Forgot Password Routes
 */
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

/**
 * @desc    Get Me Route
 */
router.get('/me', protect, getMe);

/**
 * @desc    Upload Avatar Route
 */
router.post('/me/avatar', protect, upload.single('avatar'), updateAvatar);

/**
 * @desc    Logout Route
 */
router.post('/logout', protect, logout);

module.exports = router;
