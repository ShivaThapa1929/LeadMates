require('dotenv').config();

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
        SERVICE: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        HOST: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        USER: process.env.EMAIL_USER,
        PASS: process.env.EMAIL_PASS,
        FROM: process.env.EMAIL_FROM
    },

    // SMS Config (Twilio)
    SMS: {
        ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        FROM_NUMBER: process.env.TWILIO_PHONE_NUMBER
    }
};
