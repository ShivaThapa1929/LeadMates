const authService = require('./src/services/auth.service');
require('dotenv').config();

async function testPermissions() {
    try {
        console.log('Testing getUserWithPermissions for user ID 1...');
        const result = await authService.getUserWithPermissions(1);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Failed with error:');
        console.error(err);
    } finally {
        process.exit(0);
    }
}

testPermissions();
