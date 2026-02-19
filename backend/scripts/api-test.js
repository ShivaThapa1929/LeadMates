const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let accessToken = '';

const testAPI = async () => {
    console.log('🚀 Starting LeadMates API Test Suite...\n');

    try {
        // 1. Signup Test
        console.log('📝 Testing [POST] /auth/signup...');
        const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
            name: "Test Postman",
            email: `test_${Date.now()}@leadmates.com`,
            password: "Password123!",
            phone: "1234567890",
            businessName: "Postman Corp",
            website: "https://postman.com",
            experience: "SaaS / Software"
        });
        console.log('✅ Signup Successful!\n');

        // 2. Login Test
        console.log('🔑 Testing [POST] /auth/login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: signupRes.data.data.email,
            password: "Password123!"
        });
        accessToken = loginRes.data.data.accessToken;
        console.log('✅ Login Successful!\n');

        // 3. Get Me Test (Protected)
        console.log('👤 Testing [GET] /auth/me (Protected)...');
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('✅ Profile Fetched:', meRes.data.data.user.name);
        console.log('✅ RBAC Check: User Role is', meRes.data.data.user.roles[0], '\n');

        // 4. Leads Test
        console.log('📊 Testing [GET] /leads...');
        const leadsRes = await axios.get(`${BASE_URL}/leads`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(`✅ Leads Fetched: ${leadsRes.data.data.length} records found.\n`);

        console.log('✨ All Tests Passed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test Failed!');
        console.error('Response:', error.response?.data || error.message);
        process.exit(1);
    }
};

testAPI();
