const { body } = require('express-validator');

exports.signupValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Full Name is required')
        .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters and contain only letters')
        .matches(/^[A-Za-z ]+$/).withMessage('Full name must be at least 3 characters and contain only letters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Enter a valid email address')
        .isEmail().withMessage('Enter a valid email address')
        .normalizeEmail({ gmail_remove_dots: false }),
    body('password')
        .notEmpty().withMessage('Password must be 8+ characters with uppercase, lowercase, number and special character')
        .isLength({ min: 8 }).withMessage('Password must be 8+ characters with uppercase, lowercase, number and special character')
        .matches(/[a-z]/).withMessage('Password must be 8+ characters with uppercase, lowercase, number and special character')
        .matches(/[A-Z]/).withMessage('Password must be 8+ characters with uppercase, lowercase, number and special character')
        .matches(/[0-9]/).withMessage('Password must be 8+ characters with uppercase, lowercase, number and special character')
        .matches(/[!@#$%^&*]/).withMessage('Password must be 8+ characters with uppercase, lowercase, number and special character'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Enter a valid 10-digit phone number')
        .matches(/^[0-9]{10}$/).withMessage('Enter a valid 10-digit phone number'),
    body('businessName')
        .trim()
        .notEmpty().withMessage('Business Name is required'),
    body('website')
        .trim()
        .notEmpty().withMessage('Website is required'),
    body('experience')
        .trim()
        .notEmpty().withMessage('Industry/Sector is required'),
    body('role')
        .trim()
        .notEmpty().withMessage('Role selection is required')
        .isIn(['user', 'admin']).withMessage('Invalid role selected'),
];

exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

exports.forgotPasswordValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
];

exports.resetPasswordValidation = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)')
];



exports.resendOtpValidation = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('type').optional().isIn(['email', 'login']).withMessage('Invalid OTP type')
];
