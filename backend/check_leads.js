const { db } = require('./src/config/db');
require('dotenv').config();

async function checkLeads() {
    try {
        const [rows] = await db.raw('DESCRIBE leads');
        console.log('Leads Structure:', JSON.stringify(rows));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkLeads();
