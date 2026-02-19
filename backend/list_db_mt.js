const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.development);

async function listMigrationsInDB() {
    try {
        const migrations = await db('knex_migrations').select('*').orderBy('id', 'asc');
        console.log('Migrations in DB:', migrations);
    } catch (err) {
        console.error(err);
    } finally {
        await db.destroy();
    }
}

listMigrationsInDB();
