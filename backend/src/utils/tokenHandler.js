const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

/**
 * Generate Access Token
 */
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE || '15m'
    });
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '7d' // Refresh token typically lasts longer
    });
    return refreshToken;
};

/**
 * Generate Temporary Login Token (Pre-2FA)
 */
const generateTempToken = (userId) => {
    return jwt.sign({ id: userId, type: 'pre-2fa' }, JWT_SECRET, {
        expiresIn: '5m' // Short expiry for 2FA completion
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTempToken
};
