const { Resend } = require("resend");
require("dotenv").config(); // Ensure env vars are loaded if not already

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEmail(to, subject, html) {
    if (!resend) {
        return { success: false, error: "Resend API key missing" };
    }
    try {
        const fromAddress = process.env.EMAIL_FROM || "onboarding@resend.dev";
        const { data, error } = await resend.emails.send({
            from: fromAddress,
            to: [to],
            subject,
            html,
        });
        if (error) {
            console.error({ error });
            return { success: false, error };
        } else {
            console.log(data);
            return { success: true, data };
        }
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

module.exports = { sendEmail };