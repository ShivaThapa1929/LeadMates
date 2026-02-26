const { db } = require('./src/config/env');
const knex = require('knex')(require('./knexfile').development);

async function cleanup() {
    try {
        console.log('Cleaning up users table...');
        await knex('users').del();
        console.log('Cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
