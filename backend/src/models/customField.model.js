const { db } = require('../config/db');

const CustomField = {
    tableName: 'custom_fields',

    findAll: async () => {
        return await db(CustomField.tableName).select('*').orderBy('created_at', 'asc');
    },

    findById: async (id) => {
        return await db(CustomField.tableName).where({ id }).first();
    },

    create: async (fieldData) => {
        const [id] = await db(CustomField.tableName).insert({
            field_name: fieldData.field_name,
            field_type: fieldData.field_type || 'text',
            options: fieldData.options ? JSON.stringify(fieldData.options) : null
        });
        return await CustomField.findById(id);
    },

    update: async (id, updateData) => {
        const data = { ...updateData };
        if (data.options) {
            data.options = JSON.stringify(data.options);
        }
        await db(CustomField.tableName).where({ id }).update(data);
        return await CustomField.findById(id);
    },

    delete: async (id) => {
        return await db(CustomField.tableName).where({ id }).del();
    }
};

module.exports = CustomField;
