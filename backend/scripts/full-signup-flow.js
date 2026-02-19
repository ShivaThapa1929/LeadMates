const axios = require('axios');
const knex = require('knex');
require('dotenv').config({ path: './.env' });

const BASE_URL = 'http://localhost:5000/api';

// Database connection for fetching OTPs (simulating reading your phone/email)
const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

async function runExample() {
    console.log('🚀 --- STARTING FULL SIGNUP & VERIFICATION EXAMPLE ---\n');

    try {
        const testEmail = `example_user_${Date.now()}@gmail.com`;
        const testPhone = '9558346168';

        // 1. SIGNUP
        console.log(`📡 [STEP 1] Registering New User: ${testEmail}...`);
        const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
            name: "Example User",
            email: testEmail,
            password: "Password123!",
            phone: testPhone,
            businessName: "Example Corp",
            website: "https://example.com",
            experience: "SaaS / Software",
            role: "user"
        });

        const userId = signupRes.data.data.userId;
        console.log(`✅ Registration Successful! User ID: ${userId}\n`);

        // 2. FETCH OTPs FROM DB (Simulating checking Email/SMS)
        console.log('🔍 [STEP 2] Retrieval: Reading verification codes from database...');
        const otps = await db('otp_logs').where({ user_id: userId, is_used: false });

        const emailOtp = otps.find(o => o.type === 'email')?.otp_code;
        const mobileOtp = otps.find(o => o.type === 'mobile')?.otp_code;

        console.log(`📧 Email Code Found: ${emailOtp}`);
        console.log(`📱 Mobile Code Found: ${mobileOtp}\n`);

        // 3. VERIFY EMAIL
        console.log('🛡️ [STEP 3] Verifying Email code...');
        await axios.post(`${BASE_URL}/auth/verify-otp`, {
            userId,
            emailOtp
        });
        console.log('✅ Email Verified!\n');

        // 4. VERIFY MOBILE
        console.log('🛡️ [STEP 4] Verifying Mobile code...');
        const verifyRes = await axios.post(`${BASE_URL}/auth/verify-otp`, {
            userId,
            mobileOtp
        });
        console.log('✅ Mobile Verified! Account Activated.\n');

        // 5. LOGIN
        console.log('🔑 [STEP 5] Attempting Login with verified account...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: testEmail,
            password: "Password123!"
        });

        console.log('✅ Login Successful!');
        console.log('🎫 Access Token Issued:', loginRes.data.data.accessToken.substring(0, 20) + '...\n');

        // 6. FETCH PROFILE
        console.log('👤 [STEP 6] Fetching profile via Protected Route...');
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${loginRes.data.data.accessToken}` }
        });

        console.log(`✨ DONE! Successfully fetched profile for: ${meRes.data.data.user.name}`);
        console.log(`📊 Experience: ${meRes.data.data.user.experience}`);
        console.log(`✅ Verification Status: ${meRes.data.data.user.is_verified ? 'FULLY VERIFIED' : 'PENDING'}`);

    } catch (error) {
        console.error('\n❌ Example Failed!');
        console.error('Reason:', error.response?.data?.message || error.message);
    } finally {
        await db.destroy();
        process.exit();
    }
}

runExample();
