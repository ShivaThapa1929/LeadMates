const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendEmail } = require('../services/email.service');
const { sendSMS } = require('../services/sms.service');
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
        const { email, phone } = req.body;

        const userExists = await User.findByEmail(email);
        if (userExists) {
            return sendError(res, 'This email is already registered. Please login or use a different email.', 400);
        }

        // Create User (is_verified = false by default)
        const newUser = await User.create(req.body);

        // Send OTPs for both channels
        const emailOtp = generateOTP();
        const mobileOtp = generateOTP();

        // parallelize OTP creation and external calls
        await Promise.all([
            Otp.create(newUser.id, emailOtp, 'email'),
            Otp.create(newUser.id, mobileOtp, 'mobile')
        ]);

        // Fire and forget email/SMS (they have internal error handling)
        if (email) {
            sendEmail(email, 'Verify Your Email', `<p>Your verification code is: <strong>${emailOtp}</strong>. It expires in 5 minutes.</p>`).catch(e => console.error('Background Email Error:', e));
        }

        if (phone) {
            sendSMS(phone, `Your LeadMates mobile verification code is: ${mobileOtp}`).catch(e => console.error('Background SMS Error:', e));
        }

        sendSuccess(res, { userId: newUser.id, email, phone }, 'Registration successful. Verification codes have been sent to your email and mobile.', 201);
    } catch (error) {
        console.error('Signup Error:', error);
        sendError(res, error.message || 'Server error during registration.');
    }
};



/**
 * @desc    Send Mobile OTP
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
exports.sendOtp = async (req, res) => {
    try {
        const { phone, userId } = req.body;

        if (!phone) return sendError(res, 'Phone number is required.', 400);

        // Proper format validation (+91XXXXXXXXXX)
        const phoneRegex = /^\+91\d{10}$/; // Modified to be specific if wanted, or general international
        if (!phoneRegex.test(phone)) {
            return sendError(res, 'Invalid phone format. Please use +91XXXXXXXXXX format.', 400);
        }

        const user = await User.findById(userId);
        if (!user) return sendError(res, 'User not found.', 404);

        // Update phone if different
        if (user.phone !== phone) {
            await User.update(userId, { phone });
        }

        const otpCode = generateOTP();
        // Hashing is handled inside Otp.create as per current model design
        await Otp.create(userId, otpCode, 'mobile', 5); // 5 min expiry

        // Fire and forget SMS
        sendSMS(phone, `Your LeadMates verification code is: ${otpCode}. It expires in 5 minutes.`).catch(e => console.error('Background SMS Error:', e));

        sendSuccess(res, null, 'Verification code sent to your mobile number.');
    } catch (error) {
        console.error('Send OTP Error:', error);
        sendError(res, error.message || 'Server error sending OTP.');
    }
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

        // Handle Email OTP if provided
        if (emailOtp) {
            const emailRecord = await Otp.findValid(userId, 'email');
            if (emailRecord) {
                const isEmailValid = await Otp.verify(emailRecord, emailOtp);
                if (isEmailValid) {
                    await Otp.delete(emailRecord.id);
                    await User.markEmailVerified(userId);
                }
            }
        }

        // Handle Mobile OTP flow as per main request
        if (otp) {
            const otpRecord = await Otp.findValid(userId, 'mobile');
            if (!otpRecord) {
                return sendError(res, 'Verification code expired or too many failed attempts.', 400);
            }

            // bcrypt.compare is inside Otp.verify
            const isValid = await Otp.verify(otpRecord, otp);
            if (!isValid) {
                await Otp.incrementAttempts(otpRecord.id);
                const updatedRecord = await Otp.findValid(userId, 'mobile');
                if (!updatedRecord) {
                    return sendError(res, 'Too many failed attempts. Mobile number blocked for this code.', 400);
                }
                return sendError(res, 'Invalid verification code.', 400);
            }

            // Success: Clear OTP and update user
            await Otp.delete(otpRecord.id);
            await User.markMobileVerified(userId);
        }

        const updatedUser = await User.findById(userId);

        // Finalize Verification
        if (updatedUser.is_email_verified && updatedUser.is_phone_verified) {
            await User.markVerified(userId);

            // Issue stateless tokens - using updatedUser to avoid redundant query
            const result = await authService.login(updatedUser.email, null, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            }, true, updatedUser);

            return sendSuccess(res, { ...result, status: 'complete' }, 'Mobile number verified successfully.');
        }

        sendSuccess(res, { status: 'partial' }, 'Verification successful.');
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
        const { userId, type, phone } = req.body;
        if (!userId) return sendError(res, 'User identity is required.', 400);

        const user = await User.findById(userId);
        if (!user) return sendError(res, 'User not found.', 404);

        const targetType = type || 'mobile';
        const otpCode = generateOTP();

        if (targetType === 'email') {
            await Otp.create(userId, otpCode, 'email', 5);
            sendEmail(user.email, 'Verification Code', `<p>Your code is: <strong>${otpCode}</strong>. Expires in 5m.</p>`).catch(e => console.error('Background Email Error:', e));
            return sendSuccess(res, null, 'Verification code resent to your email.');
        }

        if (targetType === 'login') {
            await Otp.create(userId, otpCode, 'login', 10);

            const tasks = [];
            tasks.push(sendEmail(user.email, 'Security Code', `<p>Your code is: <strong>${otpCode}</strong>. Expires in 10m.</p>`));

            if (user.is_phone_verified && user.phone) {
                tasks.push(sendSMS(user.phone, `Your security code is: ${otpCode}`));
            }

            Promise.all(tasks).catch(e => console.error('Background Resend Error:', e));
            return sendSuccess(res, null, 'Security code resent.');
        }

        // Mobile flow
        const targetPhone = phone || user.phone;
        if (!targetPhone) return sendError(res, 'Phone number is required.', 400);

        await Otp.create(userId, otpCode, 'mobile', 5);
        sendSMS(targetPhone, `Your LeadMates verification code is: ${otpCode}. Expires in 5m.`).catch(e => console.error('Background SMS Error:', e));

        return sendSuccess(res, null, 'Verification code resent to your mobile.');
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
            return sendError(res, 'Account not verified.', 403, { errorCode: 'NOT_VERIFIED', userId: user.id });
        }

        // Phase 2: Initiate 2FA
        const tempToken = generateTempToken(user.id);
        const otpCode = generateOTP();

        // We'll use 'login' as a generic type for 2FA OTPs to allow verification from either channel
        await Otp.create(user.id, otpCode, 'login', 10); // 10 min expiry for login 2FA

        // Fire and forget Email/SMS
        const tasks = [];
        tasks.push(sendEmail(email, 'Login Verification Code', `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb;">Security Code</h2>
                <p>Use the following code to complete your login to LeadMates:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
                    ${otpCode}
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes.</p>
            </div>
        `));

        // Send OTP via Mobile if verified
        if (user.is_phone_verified && user.phone) {
            tasks.push(sendSMS(user.phone, `Your LeadMates login security code is: ${otpCode}`));
        }

        Promise.all(tasks).catch(e => console.error('Background Login 2FA Error:', e));

        sendSuccess(res, {
            require2fa: true,
            tempToken,
            userId: user.id,
            channel: user.is_phone_verified ? 'both' : 'email',
            message: user.is_phone_verified
                ? `Verification code sent to ${email} and your mobile.`
                : `Verification code sent to ${email}`
        }, '2FA Verification Required');

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
        const otpRecord = await Otp.findValid(userId, 'login');

        if (!otpRecord) {
            return sendError(res, 'Verification code expired.', 400);
        }

        const isValid = await Otp.verify(otpRecord, otp);
        if (!isValid) {
            await Otp.incrementAttempts(otpRecord.id);
            return sendError(res, 'Invalid verification code.', 400);
        }

        await Otp.delete(otpRecord.id);

        const user = await User.findById(userId);
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
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return sendError(res, 'Refresh token is required.', 400);
        }

        const result = await authService.refresh(refreshToken);
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
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
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
            // But for LeadMates logic, we usually tell them.
            return sendError(res, 'Email not found.', 404);
        }

        const otpCode = generateOTP();
        await Otp.create(user.id, otpCode, 'email');

        // Fire and forget Email
        sendEmail(email, 'Password Reset Code', `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb;">Password Reset</h2>
                <p>You requested a password reset. Use the code below to update your key:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">
                    ${otpCode}
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
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
