const authService = require('./src/services/auth.service');
require('dotenv').config();

async function testLogin() {
    try {
        console.log('Attempting test login for testuser@example.com...');
        // We need to know the password. From previous logs, it's usually "Password123" or similar in these setups.
        // But since I don't know it, I might get "Invalid credentials" which is a 401.
        // If I get a 500, it proves my theory.
        const result = await authService.login('testuser@example.com', 'somepassword');
        console.log('Login Result:', result);
    } catch (err) {
        console.error('Login Failed with error:');
        console.error(err);
    } finally {
        process.exit(0);
    }
}

testLogin();
