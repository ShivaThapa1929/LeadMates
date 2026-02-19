const { db } = require('../config/db');

const Suspect = {
    tableName: 'suspects',

    findAll: async () => {
        return await db(Suspect.tableName).orderBy('created_at', 'desc');
    },

    findAllByUserId: async (userId) => {
        return await db(Suspect.tableName).where({ user_id: userId }).orderBy('created_at', 'desc');
    },

    findById: async (id) => {
        return await db(Suspect.tableName).where({ id }).first();
    },

    create: async (data) => {
        const [id] = await db(Suspect.tableName).insert(data);
        return await Suspect.findById(id);
    },

    delete: async (id) => {
        return await db(Suspect.tableName).where({ id }).del();
    },

    initTable: async () => {
        const exists = await db.schema.hasTable(Suspect.tableName);
        if (!exists) {
            await db.schema.createTable(Suspect.tableName, (table) => {
                table.increments('id').primary();
                table.integer('user_id').unsigned().notNullable()
                    .references('id').inTable('users').onDelete('CASCADE');
                table.string('name').notNullable();
                table.timestamps(true, true);
            });
            console.log('Suspects table created');
        }
    }
};

module.exports = Suspect;
