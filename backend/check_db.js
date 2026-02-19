const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.development);

async function checkSchema() {
    try {
        const tables = await db.raw('SHOW TABLES');
        console.log('Tables:', tables[0]);

        for (const tableObj of tables[0]) {
            const tableName = Object.values(tableObj)[0];
            const columns = await db.raw(`DESCRIBE ${tableName}`);
            console.log(`\nTable: ${tableName}`);
            console.log(columns[0].map(c => `${c.Field} (${c.Type})`).join(', '));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await db.destroy();
    }
}

checkSchema();
