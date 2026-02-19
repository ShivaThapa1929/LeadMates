const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/responseHandler');

/**
 * @desc General Rate Limiter for OTP Endpoints
 * Limits requests to prevent brute force and spamming.
 */
const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP or phone to 5 OTP requests per window
    keyGenerator: (req) => {
        return req.body.phone || req.body.userId || req.ip;
    },
    message: {
        success: false,
        message: 'Too many requests. Please try again after 15 minutes.',
        errors: null
    },
    standardHeaders: true,
    legacyHeaders: false,
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
    max: 10, // Max 10 verification attempts...
    keyGenerator: (req) => {
        return req.body.userId || req.ip;
    },
    message: {
        success: false,
        message: 'Too many failed verification attempts. Please try again later.',
        errors: null
    },
    handler: (req, res, next, options) => {
        sendError(res, options.message.message, 429);
    }
});

module.exports = {
    otpRateLimiter,
    verificationRateLimiter
};
