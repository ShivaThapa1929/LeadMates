const knex = require('knex');
const knexConfig = require('../../knexfile');
const { NODE_ENV, DB } = require('./env');

/**
 * Select configuration based on environment
 */
const config = NODE_ENV === 'production' ? knexConfig.production : knexConfig.development;

/**
 * Initialize Knex instance
 */
const db = knex(config);

/**
 * @desc Verify Database Connection
 */
const connectDB = async () => {
    try {
        await db.raw('SELECT 1');
        console.log(`✅ MySQL Connected Successfully: ${DB.database}`);
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
        console.error('Please ensure your MySQL server is running and the database specified in .env exists.');
        process.exit(1);
    }
};

module.exports = { db, connectDB };
