const { db } = require('./src/config/db');
require('dotenv').config();

async function checkSchema() {
    try {
        const [rows] = await db.raw('DESCRIBE users');
        console.log(JSON.stringify(rows.map(r => r.Field)));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSchema();
