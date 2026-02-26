const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Debug log (sanitized)
console.log('[CONFIG] 🌐 Loading environment variables...');
if (!process.env.DB_USER) {
    console.warn('[CONFIG] ❌ CRITICAL: DB_USER is not defined in .env!');
} else {
    console.log(`[CONFIG] ✅ DB_USER: ${process.env.DB_USER}`);
    console.log(`[CONFIG] ✅ DB_NAME: ${process.env.DB_NAME}`);
    console.log(`[CONFIG] 🔑 DB_PASSWORD: ${process.env.DB_PASSWORD ? 'PRESENT (HIDDEN)' : 'NOT DETECTED (EMPTY)'}`);
}

module.exports = {
    PORT: process.env.PORT || 5000,
    DB: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    JWT_SECRET: process.env.JWT_SECRET || 'your_access_token_secret_key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '1d',
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Email Config
    EMAIL: {
        SERVICE: process.env.EMAIL_SERVICE, // e.g., 'gmail', 'resend'
        HOST: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        USER: process.env.EMAIL_USER,
        PASS: process.env.EMAIL_PASS,
        FROM: process.env.EMAIL_FROM,
        RESEND_API_KEY: process.env.RESEND_API_KEY
    }
};
