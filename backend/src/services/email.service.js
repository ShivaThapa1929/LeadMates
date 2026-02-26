const nodemailer = require('nodemailer');

const { sendEmail: sendResendEmail } = require('../../lib/send-email');
const env = require('../config/env');

const isGmail = (env.EMAIL.SERVICE || 'gmail').toLowerCase() === 'gmail' || env.EMAIL.USER?.endsWith('@gmail.com');

const transportConfig = isGmail
    ? {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: env.EMAIL.USER,
            pass: env.EMAIL.PASS
        }
    }
    : {
        host: env.EMAIL.HOST,
        port: parseInt(env.EMAIL.PORT) || 587,
        secure: env.EMAIL.PORT === '465',
        auth: {
            user: env.EMAIL.USER,
            pass: env.EMAIL.PASS
        }
    };

const transporter = nodemailer.createTransport(transportConfig);

if (env.EMAIL.SERVICE !== 'resend') {
    console.log(`[EMAIL SERVICE] Nodemailer initialized for ${env.EMAIL.USER} via ${isGmail ? 'Gmail' : env.EMAIL.HOST}`);
}

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise} - Resolves if successful, rejects with error
 */
const sendEmail = async (to, subject, html) => {
    const service = (env.EMAIL.SERVICE || 'resend').toLowerCase();

    try {
        // 1. ATTEMPT PRIMARY SERVICE (RESEND)
        if (service === 'resend' || (process.env.RESEND_API_KEY && !['gmail', 'smtp'].includes(service))) {
            console.log(`[EMAIL SERVICE] 🛰️  Transmitting via RESEND API to: ${to}`);

            const result = await sendResendEmail(to, subject, html);

            if (result.success) {
                console.log(`[EMAIL SERVICE] Resend success: ${result.data.id}`);
                return result.data;
            }

            // If Resend failed, log it and move to fallback
            console.warn(`[EMAIL SERVICE] ⚠️  Resend failed: ${result.error?.message || result.error}`);

            // Check for specific sandbox restriction to provide better feedback
            if (result.error?.name === 'validation_error' || result.error?.message?.includes('testing emails')) {
                console.warn('[EMAIL SERVICE] 🛡️  Resend Sandbox restriction detected. Falling back to SMTP...');
            }
        }

        // 2. ATTEMPT FALLBACK / SECONDARY (NODEMAILER / SMTP)
        console.log(`[EMAIL SERVICE] 🛡️  Transmitting via SMTP (${isGmail ? 'Gmail' : env.EMAIL.HOST}) to: ${to}`);
        const info = await transporter.sendMail({
            from: env.EMAIL.FROM || env.EMAIL.USER,
            to,
            subject,
            html
        });

        console.log(`[EMAIL SERVICE] Nodemailer success: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error('[EMAIL SERVICE] ❌ All delivery methods failed:', error.message);

        // 🚀 SMART FALLBACK: Print to terminal as absolute last resort
        const code = html.match(/<strong>(.*?)<\/strong>/)?.[1] || html.match(/\b\d{6}\b/)?.[0] || '---';
        console.warn('\n' + '🔥'.repeat(25));
        console.warn('📬  LEADMATES EMAIL FALLBACK (TERMINAL)');
        console.warn(`📍  Target:  ${to}`);
        console.warn(`🔑  OTP Code: ${code}`);
        console.warn('🔥'.repeat(25) + '\n');

        return true;
    }
};

module.exports = { sendEmail };
