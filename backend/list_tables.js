const { db } = require('./src/config/db');
require('dotenv').config();

async function listTables() {
    try {
        const [rows] = await db.raw('SHOW TABLES');
        const dbName = Object.keys(rows[0])[0];
        const tables = rows.map(r => r[dbName]);
        console.log('Tables:', JSON.stringify(tables));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

listTables();
