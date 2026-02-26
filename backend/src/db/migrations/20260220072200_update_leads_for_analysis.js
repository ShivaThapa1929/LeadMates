/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Remove Projects Table completely
    await knex.schema.dropTableIfExists('projects');

    // 2. Update Leads Table for Analysis
    await knex.schema.alterTable('leads', async (table) => {
        const hasCampaignType = await knex.schema.hasColumn('leads', 'campaign_type');
        const hasCampaignName = await knex.schema.hasColumn('leads', 'campaign_name');
        const hasSource = await knex.schema.hasColumn('leads', 'source');

        if (!hasCampaignType) table.string('campaign_type').nullable();
        if (!hasCampaignName) table.string('campaign_name').nullable();
        if (!hasSource) table.string('source').nullable();

        // Update status to support new values
        // Note: Knex doesn't have a direct 'alter column enum' that works across all DBs easily
        // We will use raw or just add/change if possible. For SQLite/MySQL differences, raw is safer
        // but since we want 'new', 'contacted', 'converted', 'lost', we can just use string and validate in app
    });

    // Handle status column update (optional migration logic if needed to keep data)
    // For now, let's just make sure it supports the new values if it's a string or update the enum if we can
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('leads', (table) => {
        table.dropColumns('campaign_type', 'campaign_name', 'source');
    });

    await knex.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('name').notNullable();
        table.string('description').nullable();
        table.enum('status', ['PLANNING', 'IN_PROGRESS', 'COMPLETED']).defaultTo('PLANNING');
        table.timestamps(true, true);
    });
};
