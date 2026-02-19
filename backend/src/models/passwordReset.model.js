const { db } = require('../config/db');

/**
 * Password Reset Model
 */
const PasswordReset = {
    tableName: 'password_reset_tokens',

    /**
     * @desc Create a new password reset token
     */
    create: async (userId, token) => {
        // Delete any existing tokens for this user first
        await db(PasswordReset.tableName).where({ user_id: userId }).del();

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        const [id] = await db(PasswordReset.tableName).insert({
            user_id: userId,
            token,
            expires_at: expiresAt
        });

        return { id, token, expiresAt };
    },

    /**
     * @desc Find token
     */
    findByToken: async (token) => {
        return await db(PasswordReset.tableName)
            .where({ token })
            .andWhere('expires_at', '>', new Date())
            .first();
    },

    /**
     * @desc Delete tokens for a user (after successful reset)
     */
    deleteByUser: async (userId) => {
        return await db(PasswordReset.tableName).where({ user_id: userId }).del();
    }
};

module.exports = PasswordReset;
