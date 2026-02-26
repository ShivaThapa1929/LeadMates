const { db } = require('./src/config/db');
require('dotenv').config();

async function checkLeadsSchema() {
    try {
        const [rows] = await db.raw('DESCRIBE leads');
        console.log('Columns in leads table:');
        console.log(JSON.stringify(rows.map(r => r.Field)));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkLeadsSchema();
