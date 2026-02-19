const { db } = require('../config/db');

const Lead = {
    tableName: 'leads',

    // Find ALL leads (Admin)
    findAll: async () => {
        return await db(Lead.tableName)
            .leftJoin('users as creator', 'leads.user_id', 'creator.id')
            .leftJoin('users as assignee', 'leads.assigned_to', 'assignee.id')
            .where('leads.is_deleted', false)
            .select(
                'leads.*',
                'creator.name as creator_name',
                'assignee.name as assignee_name'
            )
            .orderBy('leads.created_at', 'desc');
    },

    // Find leads for a specific user (Created by them OR Assigned to them)
    findUserLeads: async (userId) => {
        return await db(Lead.tableName)
            .leftJoin('users as creator', 'leads.user_id', 'creator.id')
            .leftJoin('users as assignee', 'leads.assigned_to', 'assignee.id')
            .where((builder) => {
                builder.where('leads.user_id', userId)
                    .orWhere('leads.assigned_to', userId);
            })
            .andWhere('leads.is_deleted', false)
            .select(
                'leads.*',
                'creator.name as creator_name',
                'assignee.name as assignee_name'
            )
            .orderBy('leads.created_at', 'desc');
    },

    // Find lead by ID
    findById: async (id) => {
        return await db(Lead.tableName).where({ id, is_deleted: false }).first();
    },

    // Create new lead
    create: async (leadData) => {
        const [id] = await db(Lead.tableName).insert(leadData);
        return await Lead.findById(id);
    },

    // Update lead
    update: async (id, updateData) => {
        await db(Lead.tableName).where({ id }).update(updateData);
        return await Lead.findById(id);
    },

    // Delete lead (Soft Delete)
    delete: async (id, userId) => {
        return await db(Lead.tableName).where({ id }).update({
            is_deleted: true,
            deleted_at: db.fn.now(),
            deleted_by: userId
        });
    },

    // Initialize table
    initTable: async () => {
        const exists = await db.schema.hasTable(Lead.tableName);
        if (!exists) {
            await db.schema.createTable(Lead.tableName, (table) => {
                table.increments('id').primary();
                table.integer('user_id').unsigned().notNullable()
                    .references('id').inTable('users').onDelete('CASCADE');
                table.string('name').notNullable();
                table.string('email').nullable();
                table.string('phone').notNullable();
                table.string('channel').notNullable().defaultTo('Social / FB Ads');
                table.enum('status', ['NEW', 'CONTACTED', 'SUSPECTED', 'CONVERTED']).defaultTo('NEW');
                table.timestamps(true, true);
            });
            console.log('Leads table created');
        }
    }
};

module.exports = Lead;
