const { body } = require('express-validator');

exports.signupValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email format')
        .normalizeEmail({ gmail_remove_dots: false }),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character (!@#$%^&*)'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number in international format (e.g., +91XXXXXXXXXX)'),
    body('businessName')
        .trim()
        .notEmpty().withMessage('Business Name is required')
        .isLength({ min: 2 }).withMessage('Business Name must be at least 2 characters'),
    body('website')
        .trim()
        .notEmpty().withMessage('Website is required'),
    body('experience')
        .trim()
        .notEmpty().withMessage('Industry/Sector is required'),
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Invalid role specified')
];

exports.loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail({ gmail_remove_dots: false }),
    body('password')
        .notEmpty().withMessage('Password is required')
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

exports.mobileOtpValidation = [
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+[1-9]\d{1,14}$/).withMessage('Invalid phone format'),
    body('userId')
        .notEmpty().withMessage('User ID is required')
];

exports.resendOtpValidation = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('type').optional().isIn(['email', 'mobile', 'login']).withMessage('Invalid OTP type'),
    body('phone').optional().matches(/^\+[1-9]\d{1,14}$/).withMessage('Invalid phone format')
];
