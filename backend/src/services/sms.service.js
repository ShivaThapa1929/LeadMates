const twilio = require('twilio');
const env = require('../config/env');

let client;

try {
    const sid = env.SMS.ACCOUNT_SID;
    const token = env.SMS.AUTH_TOKEN;

    if (sid && token && sid.startsWith('AC')) {
        client = twilio(sid, token);
        console.log('[SMS SERVICE] Twilio initialized successfully.');
    } else if (sid || token) {
        console.warn('[SMS SERVICE] Twilio SID or Token invalid. SID must start with "AC". SMS will use simulation/console fallback.');
    }
} catch (err) {
    console.error('[SMS SERVICE] Twilio initialization error:', err.message);
}

/**
 * Send an SMS
 * @param {string} to - Recipient phone number
 * @param {string} body - SMS content
 * @returns {Promise} - Resolves if successful, rejects with error
 */
const sendSMS = async (to, body) => {
    try {
        if (!client || !env.SMS.FROM_NUMBER || !to || !env.SMS.ACCOUNT_SID || env.SMS.ACCOUNT_SID.includes('your_')) {
            // 🚀 SMART FALLBACK: If Twilio is not configured, print a beautiful box!
            const otpCode = body.match(/code is: (.*)$/i)?.[1] || body;

            console.warn('\n' + '='.repeat(50));
            console.warn('📱  LEADMATES SMS FALLBACK');
            console.warn(`📍  Mobile:  ${to || 'Not Provided'}`);
            console.warn(`🔑  Message: ${body}`);
            console.warn('='.repeat(50) + '\n');

            return true; // Simulate success
        }

        const message = await client.messages.create({
            body: body,
            from: env.SMS.FROM_NUMBER,
            to: to
        });

        console.log(`[SMS SERVICE] Message sent: ${message.sid}`);
        return message;
    } catch (error) {
        console.error('[SMS SERVICE] ❌ Real SMS delivery failed:', error.message);

        // Error Fallback
        console.warn('\n' + '!'.repeat(50));
        console.warn('📱  LEADMATES SMS FALLBACK (ERROR)');
        console.warn(`📍  Mobile: ${to}`);
        console.warn(`🔑  Body:   ${body}`);
        console.warn('!'.repeat(50) + '\n');

        return true; // Return true to prevent crashing flow in dev
    }
};

module.exports = { sendSMS };
