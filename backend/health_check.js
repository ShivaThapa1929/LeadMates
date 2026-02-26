const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.development);

async function checkStatus() {
    try {
        console.log('--- Database Health Check ---');
        const [tables] = await db.raw('SHOW TABLES');
        const dbName = config.development.connection.database;
        const tableNames = tables.map(t => t[`Tables_in_${dbName}`]);

        console.log('Tables found:', tableNames.join(', '));

        for (const table of tableNames) {
            const [count] = await db(table).count('* as count');
            console.log(`Table ${table}: ${count.count} rows`);
        }

        console.log('\n--- Migration Status ---');
        const migrationStatus = await db.migrate.status();
        console.log('Migrations up to date:', migrationStatus === 0);

        process.exit(0);
    } catch (err) {
        console.error('Database check failed:', err.message);
        process.exit(1);
    }
}

checkStatus();
