const { db } = require('../config/db');

const Permission = {
    tableName: 'permissions',

    findAll: async () => {
        return await db(Permission.tableName).select('*');
    },

    findById: async (id) => {
        return await db(Permission.tableName).where({ id }).first();
    },

    findByName: async (name) => {
        return await db(Permission.tableName).where({ name }).first();
    },

    create: async (data) => {
        const [id] = await db(Permission.tableName).insert(data);
        return await Permission.findById(id);
    },

    update: async (id, data) => {
        return await db(Permission.tableName).where({ id }).update(data);
    },

    delete: async (id) => {
        return await db(Permission.tableName).where({ id }).del();
    }
};

module.exports = Permission;
