const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendEmail } = require('../services/email.service');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { generateTempToken } = require('../utils/tokenHandler');
const { JWT_SECRET } = require('../config/env');

const generateOTP = () => otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
});

/**
 * @desc    Register a new user & Send OTPs
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        let { email, phone, role, password } = req.body;

        // Normalize phone for Twilio (+91 for 10-digit India format)
        if (phone && /^\d{10}$/.test(phone)) {
            phone = `+91${phone}`;
            req.body.phone = phone;
        }

        // 1. Global Uniqueness Check
        const emailExists = await User.findByEmail(email);
        if (emailExists) {
            console.log('⚠️ Signup Conflict: Email already exists -', email);
            return sendError(res, 'Identity conflict: This email is already registered.', 400);
        }

        const phoneExists = await User.findByPhone(phone);
        if (phoneExists) {
            console.log('⚠️ Signup Conflict: Phone already exists -', phone);
            return sendError(res, 'Identity conflict: This phone number is already registered.', 400);
        }

        // ... rest of validation logic handled by express-validator middleware ...

        // 3. Create User
        const newUser = await User.create({ ...req.body, role: role || 'user' });

        // 4. Log in the user immediately (OTP Skip)
        const result = await authService.login(newUser.email, null, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }, true, newUser);

        // Security: Set Refresh Token as HttpOnly Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove refreshToken from response data to enforce cookie usage
        delete result.refreshToken;

        sendSuccess(res, result, 'Account created successfully and logged in.', 201);
    } catch (error) {
        console.error('Signup Failure:', error);
        sendError(res, error.message || 'Server error during signup.');
    }
};

/**
 * @desc    Send OTP (Deprecated - Mobile OTP removed)
 */
exports.sendOtp = async (req, res) => {
    return sendError(res, 'Mobile OTP functionality has been disabled.', 400);
};

/**
 * @desc    Verify Mobile OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
exports.verifyOtp = async (req, res) => {
    try {
        const { userId, otp, emailOtp } = req.body;

        if (!userId) return sendError(res, 'User identity is missing.', 400);

        const user = await User.findById(userId);
        if (!user) return sendError(res, 'User not found.', 404);

        // Handle Email OTP (Manual DB way)
        const codeToVerify = otp || emailOtp;
        if (codeToVerify) {
            const emailRecord = await Otp.findValid(userId, 'email');
            if (emailRecord) {
                const isEmailValid = await Otp.verify(emailRecord, codeToVerify);
                if (isEmailValid) {
                    await Otp.delete(emailRecord.id);
                    await User.markEmailVerified(userId);
                } else {
                    return sendError(res, 'Invalid verification code.', 400);
                }
            } else {
                return sendError(res, 'Verification code expired or invalid.', 400);
            }
        }

        const updatedUser = await User.findById(userId);

        // Finalize Verification (Only Email required now)
        if (updatedUser.email_verified) {
            await User.markVerified(userId);

            const result = await authService.login(updatedUser.email, null, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            }, true, updatedUser);

            // Security: Set Refresh Token as HttpOnly Cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Remove refreshToken from response data to enforce cookie usage
            delete result.refreshToken;

            return sendSuccess(res, { ...result, status: 'complete' }, 'Verification complete.');
        }

        sendSuccess(res, { status: 'partial' }, 'Verification step successful.');
    } catch (error) {
        console.error('Verify OTP Error:', error);
        sendError(res, error.message || 'Server error verifying OTP.');
    }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
exports.resendOtp = async (req, res) => {
    try {
        const { userId, type } = req.body;
        if (!userId) return sendError(res, 'User identity is required.', 400);

        const user = await User.findById(userId);
        if (!user) return sendError(res, 'User not found.', 404);

        const targetType = type || 'email';
        const otpCode = generateOTP();

        if (targetType === 'email') {
            await Otp.create(userId, otpCode, 'email', 5);
            sendEmail(user.email, 'Verification OTP - LeadMates', `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; border: 1px solid #e1e7ef; border-radius: 20px; max-width: 500px; margin: auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">Verification Code</h1>
                        <p style="color: #64748b; margin-top: 8px;">Complete your LeadMates registration</p>
                    </div>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Use the following 6-digit code to verify your identity at LeadMates:</p>
                    
                    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0; border: 1px solid #bae6fd;">
                        <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #0284c7; font-family: monospace;">
                            ${otpCode}
                        </div>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in <strong style="color: #1e293b;">5 minutes</strong>.</p>
                    
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
                    
                    <p style="color: #ef4444; font-size: 12px; font-weight: bold; text-align: center;">⚠️ Security Note: Do not share this OTP with anyone.</p>
                </div>
            `).catch(e => console.error('Background Email Error:', e));
            return sendSuccess(res, null, 'Verification code resent to your email.');
        }

        if (targetType === 'login') {
            await Otp.create(userId, otpCode, 'login', 10);
            sendEmail(user.email, 'Login Security OTP - LeadMates', `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; border: 1px solid #e1e7ef; border-radius: 20px; max-width: 500px; margin: auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">Security Verification</h1>
                        <p style="color: #64748b; margin-top: 8px;">Authorize your login to LeadMates</p>
                    </div>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Please use the code below to authorize your secure login:</p>
                    
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0; border: 1px solid #e2e8f0;">
                        <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #1e293b; font-family: monospace;">
                            ${otpCode}
                        </div>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in <strong style="color: #1e293b;">10 minutes</strong>.</p>
                    
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
                    
                    <p style="color: #ef4444; font-size: 12px; font-weight: bold; text-align: center;">⚠️ Security Note: Do not share this OTP with anyone.</p>
                </div>
            `).catch(e => console.error('Background Email Error:', e));
            return sendSuccess(res, null, 'Security code resent to your email.');
        }

        // Default flow
        await Otp.create(userId, otpCode, 'email', 5);
        sendEmail(user.email, 'Verification OTP - LeadMates', `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; border: 1px solid #e1e7ef; border-radius: 20px; max-width: 500px; margin: auto;">
                <h2 style="color: #2563eb; text-align: center;">Verify Your Identity</h2>
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1e293b; margin: 25px 0; border: 1px solid #cbd5e1;">
                    ${otpCode}
                </div>
                <p style="color: #64748b; font-size: 13px; text-align: center;">This code expires in <strong>5 minutes</strong>.</p>
            </div>
        `).catch(e => console.error('Background Email Error:', e));
        return sendSuccess(res, null, 'Verification code resent to your email.');
    } catch (error) {
        console.error('Resend OTP Error:', error);
        sendError(res, error.message || 'Server error resending OTP.');
    }
};

/**
 * @desc    Authenticate user (Phase 1: Credentials -> Email OTP)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return sendError(res, 'Invalid credentials.', 401);
        }

        const isMatch = await User.matchPassword(password, user.password);
        if (!isMatch) {
            return sendError(res, 'Invalid credentials.', 401);
        }

        if (!user.is_verified) {
            return sendError(res, 'Security restriction: Account verification required.', 403, { errorCode: 'NOT_VERIFIED', userId: user.id });
        }

        // Phase 2: Complete Login immediately (Bypass 2FA)
        const result = await authService.login(user.email, null, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }, true, user);

        // Security: Set Refresh Token as HttpOnly Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove refreshToken from response data to enforce cookie usage
        delete result.refreshToken;

        sendSuccess(res, result, 'Login successful');

    } catch (error) {
        console.error('Login Error:', error);
        sendError(res, error.message || 'Server error during login.');
    }
};

/**
 * @desc    Verify 2FA OTP & Issue Final Tokens
 * @route   POST /api/auth/verify-login-2fa
 * @access  Public
 */
exports.verifyLogin2FA = async (req, res) => {
    try {
        const { tempToken, otp } = req.body;

        if (!tempToken || !otp) {
            return sendError(res, 'Authentication session or code is missing.', 400);
        }

        let decoded;
        try {
            decoded = jwt.verify(tempToken, JWT_SECRET);
        } catch (err) {
            return sendError(res, 'Session expired. Please login again.', 401);
        }

        const userId = decoded.id;
        const user = await User.findById(userId);

        let isVerified = false;

        // 1. Manual DB (Email/Login) Verify
        const otpRecord = await Otp.findValid(userId, 'login');
        if (otpRecord) {
            isVerified = await Otp.verify(otpRecord, otp);
            if (isVerified) await Otp.delete(otpRecord.id);
        }

        if (!isVerified) {
            return sendError(res, 'Invalid or expired verification code.', 400);
        }

        // Success: Login user
        const result = await authService.login(user.email, null, {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }, true, user);

        // Security: Set Refresh Token as HttpOnly Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        delete result.refreshToken;
        sendSuccess(res, result, 'Login successful');
    } catch (error) {
        console.error('2FA Verification Error:', error);
        sendError(res, error.message || 'Server error during 2FA.');
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
exports.refreshToken = async (req, res) => {
    try {
        // 1. Get token from secure cookie or fallback to body
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            return sendError(res, 'Refresh token is required.', 401);
        }

        const result = await authService.refresh(token);

        // 2. Security: Refresh the HttpOnly Cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Remove refreshToken from body response
        delete result.refreshToken;
        sendSuccess(res, result, 'Token refreshed');
    } catch (error) {
        console.error('Refresh Token Error:', error);
        sendError(res, error.message || 'Invalid refresh token.', 401);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        sendSuccess(res, { user: req.user }, 'User profile fetched');
    } catch (error) {
        sendError(res, 'Server error fetching profile.');
    }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/auth/me/avatar
 * @access  Private
 */
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 'Please upload an image file.', 400);
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        // Update user in database
        await User.update(req.user.id, { avatar: avatarPath });

        // Get updated user data with permissions correctly via service
        const userData = await authService.getUserWithPermissions(req.user.id);

        sendSuccess(res, {
            avatar: avatarPath,
            user: userData
        }, 'Profile picture updated successfully');
    } catch (error) {
        console.error('Avatar Update Error:', error);
        sendError(res, error.message || 'Server error during profile picture update.');
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        sendSuccess(res, null, 'Logged out successfully.');
    } catch (error) {
        console.error('Logout Error:', error);
        sendError(res, 'Server error during logout.');
    }
};

/**
 * @desc    Request Password Reset (Sends 6-digit OTP)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            // Security: Don't reveal if user exists. 
            return sendSuccess(res, null, 'If this email is registered, a reset code has been sent.');
        }

        const otpCode = generateOTP();
        await Otp.create(user.id, otpCode, 'email');

        // Fire and forget Email with Premium Template
        sendEmail(email, 'Password Reset OTP - LeadMates', `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; border: 1px solid #e1e7ef; border-radius: 20px; max-width: 500px; margin: auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">Password Reset</h1>
                    <p style="color: #64748b; margin-top: 8px;">Secure access recovery for LeadMates</p>
                </div>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">You've requested to reset your password. Please use the following verification code to proceed:</p>
                
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px; border-radius: 16px; text-align: center; margin: 30px 0; border: 1px solid #e2e8f0;">
                    <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #2563eb; font-family: monospace;">
                        ${otpCode}
                    </div>
                </div>
                
                <p style="color: #64748b; font-size: 14px; text-align: center;">This code will expire in <strong style="color: #1e293b;">5 minutes</strong>.</p>
                
                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
                
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">If you did not request this password reset, please ignore this email or contact support if you have concerns about your account security.</p>
                
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #cbd5e1; font-size: 12px;">&copy; 2024 LeadMates Inc. All rights reserved.</p>
                </div>
            </div>
        `).catch(e => console.error('Background Password Reset Email Error:', e));

        sendSuccess(res, { userId: user.id }, 'Password reset code has been sent to your email.');
    } catch (error) {
        console.error('Forgot Password Error:', error);
        sendError(res, 'Server error processing request.');
    }
};

/**
 * @desc    Reset Password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
    try {
        const { userId, otp, password } = req.body;

        if (!userId || !otp || !password) {
            return sendError(res, 'User ID, code, and new password are required.', 400);
        }

        const otpRecord = await Otp.findValid(userId, 'email');
        if (!otpRecord) {
            return sendError(res, 'Verification code expired or invalid.', 400);
        }

        const isValid = await Otp.verify(otpRecord, otp);
        if (!isValid) {
            await Otp.incrementAttempts(otpRecord.id);
            return sendError(res, 'Invalid verification code.', 400);
        }

        // Success: Update Password
        await User.update(userId, { password });

        // Clean up
        await Otp.delete(otpRecord.id);

        sendSuccess(res, null, 'Password has been reset successfully. You can now login.');
    } catch (error) {
        console.error('Reset Password Error:', error);
        sendError(res, 'Server error resetting password.');
    }
};
