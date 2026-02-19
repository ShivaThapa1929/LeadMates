const axios = require('axios');

async function testApiLogin() {
    try {
        console.log('Testing login endpoint at http://localhost:5000/api/auth/login');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testuser@example.com',
            password: 'Password123' // Guessing common password
        });
        console.log('Status:', response.status);
        console.log('Data:', response.data);
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
