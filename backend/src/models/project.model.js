const { db } = require('../config/db');

const Project = {
    tableName: 'projects',

    findAllByUserId: async (userId) => {
        return await db(Project.tableName).where({ user_id: userId, is_deleted: false }).orderBy('created_at', 'desc');
    },

    findAll: async () => {
        return await db(Project.tableName).where({ is_deleted: false }).orderBy('created_at', 'desc');
    },

    findById: async (id) => {
        return await db(Project.tableName).where({ id, is_deleted: false }).first();
    },

    create: async (data) => {
        const [id] = await db(Project.tableName).insert(data);
        return await Project.findById(id);
    },

    update: async (id, data) => {
        await db(Project.tableName).where({ id }).update(data);
        return await Project.findById(id);
    },

    delete: async (id, userId) => {
        return await db(Project.tableName).where({ id }).update({
            is_deleted: true,
            deleted_at: db.fn.now(),
            deleted_by: userId
        });
    },

    initTable: async () => {
        const exists = await db.schema.hasTable(Project.tableName);
        if (!exists) {
            await db.schema.createTable(Project.tableName, (table) => {
                table.increments('id').primary();
                table.integer('user_id').unsigned().notNullable()
                    .references('id').inTable('users').onDelete('CASCADE');
                table.string('name').notNullable();
                table.string('description').nullable();
                table.enum('status', ['PLANNING', 'IN_PROGRESS', 'COMPLETED']).defaultTo('PLANNING');
                table.timestamps(true, true);
            });
            console.log('Projects table created');
        }
    }
};

module.exports = Project;
