const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const knex = require('knex')(require('./knexfile').development);

const email = 'gauravthapa88888@gmail.com';

async function removeUser() {
    try {
        console.log(`🔍 Searching for user with email: ${email}...`);

        // Find user first to get the ID
        const user = await knex('users').where({ email }).first();

        if (!user) {
            console.log('❌ User not found in database.');
            process.exit(0);
        }

        console.log(`✅ Found user: ${user.name} (ID: ${user.id})`);
        console.log('🗑️ Deleting user and related records (OTPs, Roles)...');

        // Note: OTPs should be deleted automatically if CASCADE is set in migration, 
        // but we'll do it explicitly if not.
        await knex('otps').where({ user_id: user.id }).del();
        await knex('user_roles').where({ user_id: user.id }).del();
        await knex('users').where({ id: user.id }).del();

        console.log('✨ User successfully removed from the system.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Operation failed:', err);
        process.exit(1);
    }
}

removeUser();
