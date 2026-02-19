const { db } = require('../config/db');

const Campaign = {
    tableName: 'campaigns',

    findAll: async () => {
        return await db(Campaign.tableName).where({ is_deleted: false }).orderBy('created_at', 'desc');
    },

    findAllByUserId: async (userId) => {
        return await db(Campaign.tableName).where({ user_id: userId, is_deleted: false }).orderBy('created_at', 'desc');
    },

    findById: async (id) => {
        return await db(Campaign.tableName).where({ id, is_deleted: false }).first();
    },

    create: async (data) => {
        const [id] = await db(Campaign.tableName).insert(data);
        return await Campaign.findById(id);
    },

    update: async (id, data) => {
        await db(Campaign.tableName).where({ id }).update(data);
        return await Campaign.findById(id);
    },

    delete: async (id, userId) => {
        return await db(Campaign.tableName).where({ id }).update({
            is_deleted: true,
            deleted_at: db.fn.now(),
            deleted_by: userId
        });
    },

    initTable: async () => {
        const exists = await db.schema.hasTable(Campaign.tableName);
        if (!exists) {
            await db.schema.createTable(Campaign.tableName, (table) => {
                table.increments('id').primary();
                table.integer('user_id').unsigned().notNullable()
                    .references('id').inTable('users').onDelete('CASCADE');
                table.string('name').notNullable();
                table.enum('status', ['ACTIVE', 'PAUSED', 'COMPLETED']).defaultTo('ACTIVE');
                table.text('custom_values').nullable();
                table.timestamps(true, true);
            });
            console.log('Campaigns table created');
        }
    }
};

module.exports = Campaign;
