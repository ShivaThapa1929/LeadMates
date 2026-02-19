const axios = require('axios');

async function testApiLogin() {
    try {
        console.log('Testing login endpoint for founder@leadmates.com');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'founder@leadmates.com',
            password: 'Password123!'
        });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else {
            console.error('Request Error:', error.message);
        }
    }
}

testApiLogin();
