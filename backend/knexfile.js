const { DB } = require('./src/config/env');

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: DB.host,
            user: DB.user,
            password: DB.password,
            database: DB.database
        },
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        }
    },
    production: {
        client: 'mysql2',
        connection: {
            host: DB.host,
            user: DB.user,
            password: DB.password,
            database: DB.database
        },
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        }
    }
};
