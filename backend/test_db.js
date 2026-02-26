const knex = require('knex');
const config = require('./knexfile');

const db = knex(config.development);

async function test() {
    try {
        console.log('Testing migration logic...');
        // Try to drop table
        await db.schema.dropTableIfExists('projects');
        console.log('Projects table dropped (if existed)');

        // Try to alter leads
        await db.schema.alterTable('leads', (table) => {
            table.string('campaign_type').nullable();
            table.string('campaign_name').nullable();
            table.string('source').nullable();
        });
        console.log('Leads table altered');

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

test();
