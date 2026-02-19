const { db } = require('./src/config/db');
require('dotenv').config();

async function checkMigrations() {
    try {
        const rows = await db('knex_migrations').select('*');
        console.log(JSON.stringify(rows));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkMigrations();
