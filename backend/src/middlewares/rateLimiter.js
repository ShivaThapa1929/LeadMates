const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/responseHandler');

/**
 * @desc General Rate Limiter for OTP Endpoints
 * Limits requests to prevent brute force and spamming.
 */
const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Relaxed for development/testing
    // Removed custom keyGenerator to avoid ERR_ERL_KEY_GEN_IPV6
    message: {
        success: false,
        message: 'Too many requests. Please try again after 15 minutes.',
        errors: null
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false }, // Suppress warning for local development
    handler: (req, res, next, options) => {
        sendError(res, options.message.message, 429);
    }
});

/**
 * @desc Stricter Limiter for OTP Verification
 * Limits attempts to verify OTP to prevent brute force guessing.
 */
const verificationRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Max 10 verification attempts
    message: {
        success: false,
        message: 'Too many failed verification attempts. Please try again later.',
        errors: null
    },
    validate: { trustProxy: false },
    handler: (req, res, next, options) => {
        sendError(res, options.message.message, 429);
    }
});

/**
 * @desc Stricter Limiter for Resending OTP
 * Limits to 3 attempts per hour as per requirements.
 */
const resendOtpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Max 3 resend attempts per hour
    message: {
        success: false,
        message: 'Maximum resend attempts reached (3 per hour). Please try again later.',
        errors: null
    },
    validate: { trustProxy: false },
    handler: (req, res, next, options) => {
        sendError(res, options.message.message, 429);
    }
});

module.exports = {
    otpRateLimiter,
    verificationRateLimiter,
    resendOtpLimiter
};
