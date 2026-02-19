const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

async function testEmail() {
    console.log('Testing with User:', process.env.EMAIL_USER);
    console.log('Testing with Pass:', process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log('✅ Connection successful!');

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'LeadMates Test',
            text: 'It works!'
        });
        console.log('✅ Email sent!');
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

testEmail();
