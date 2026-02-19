const { db } = require('../config/db');

const Role = {
    tableName: 'roles',

    findAll: async () => {
        return await db(Role.tableName).select('*');
    },

    findById: async (id) => {
        return await db(Role.tableName).where({ id }).first();
    },

    findByName: async (name) => {
        return await db(Role.tableName).where({ name }).first();
    },

    /**
     * @desc Create new role
     */
    create: async (data) => {
        const { name, description, permissions, status } = data;
        const [id] = await db(Role.tableName).insert({
            name,
            description,
            permissions: JSON.stringify(permissions || {}), // Ensure it's stored as JSON
            status: status || 'active'
        });
        return await Role.findById(id);
    },

    update: async (id, data) => {
        const updateData = { ...data };
        if (updateData.permissions) {
            updateData.permissions = JSON.stringify(updateData.permissions);
        }
        return await db(Role.tableName).where({ id }).update(updateData);
    },

    delete: async (id) => {
        return await db(Role.tableName).where({ id }).del();
    }
};

module.exports = Role;
