const User = require('./src/models/user.model');
require('dotenv').config();

async function debugUsers() {
    try {
        console.log('Attempting to fetch users...');
        const users = await User.findAll();
        console.log('Success!', users.length, 'users found.');
        if (users.length > 0) {
            console.log('First user sample:', users[0]);
        }
        process.exit(0);
    } catch (error) {
        console.error('FAILED TO FETCH USERS');
        console.error(error);
        process.exit(1);
    }
}

debugUsers();
