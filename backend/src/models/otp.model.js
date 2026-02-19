const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Otp Model
 * Handles secure OTP storage and verification using the 'otps' table.
 */
const Otp = {
    tableName: 'otps',

    /**
     * @desc Create and hash a new OTP
     */
    create: async (userId, otpCode, type, expiryMinutes = 5) => {
        const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

        // Hash the OTP code
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otpCode, salt);

        // Invalidate previous unused OTPs of the same type for this user to keep table clean
        await db(Otp.tableName)
            .where({ user_id: userId, type })
            .del();

        const [id] = await db(Otp.tableName).insert({
            user_id: userId,
            otp_hash: otpHash,
            type,
            expires_at: expiresAt,
            attempts: 0
        });

        return { id, expires_at: expiresAt };
    },

    /**
     * @desc Find a valid, non-expired OTP
     */
    findValid: async (userId, type) => {
        return await db(Otp.tableName)
            .where({ user_id: userId, type })
            .where('expires_at', '>', new Date())
            .where('attempts', '<', 3) // Max 3 attempts
            .first();
    },

    /**
     * @desc Verify if code matches the hash
     */
    verify: async (otpRecord, otpCode) => {
        return await bcrypt.compare(otpCode, otpRecord.otp_hash);
    },

    /**
     * @desc Increment attempt counter
     */
    incrementAttempts: async (id) => {
        return await db(Otp.tableName)
            .where({ id })
            .increment('attempts', 1);
    },

    /**
     * @desc Delete OTP after successful use
     */
    delete: async (id) => {
        return await db(Otp.tableName)
            .where({ id })
            .del();
    }
};

module.exports = Otp;
