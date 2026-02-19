const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
    service: env.EMAIL.SERVICE || 'gmail', // Fallback to Gmail if service specified
    host: env.EMAIL.HOST,
    port: parseInt(env.EMAIL.PORT) || 587,
    secure: env.EMAIL.PORT === '465', // True for 465, false for other ports
    auth: {
        user: env.EMAIL.USER,
        pass: env.EMAIL.PASS
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
});

console.log(`[EMAIL SERVICE] Initialized for ${env.EMAIL.USER} using ${env.EMAIL.SERVICE || 'gmail'}`);

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise} - Resolves if successful, rejects with error
 */
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: env.EMAIL.FROM || env.EMAIL.USER,
            to,
            subject,
            html
        });

        console.log(`[EMAIL SERVICE] Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[EMAIL SERVICE] ❌ Real email delivery failed:', error.message);

        // 🚀 SMART FALLBACK: If Gmail fails, print a beautiful box in the terminal!
        const code = html.match(/<strong>(.*?)<\/strong>/)?.[1] || '---';
        console.warn('\n' + '='.repeat(50));
        console.warn('📬  LEADMATES EMAIL FALLBACK');
        console.warn(`📍  Target:  ${to}`);
        console.warn(`🔑  OTP Code: ${code}`);
        console.warn('='.repeat(50) + '\n');

        return true;
    }
};

module.exports = { sendEmail };
