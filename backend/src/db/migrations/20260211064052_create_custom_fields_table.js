/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Create custom_fields table
    await knex.schema.createTable('custom_fields', (table) => {
        table.increments('id').primary();
        table.string('field_name').notNullable();
        table.enum('field_type', ['text', 'select']).notNullable().defaultTo('text');
        table.json('options').nullable(); // For select options: ["Hot", "Warm", "Cold"]
        table.timestamps(true, true);
    });

    // 2. Update leads table
    const hasContact = await knex.schema.hasColumn('leads', 'contact');
    const hasCustomValues = await knex.schema.hasColumn('leads', 'custom_values');

    await knex.schema.table('leads', (table) => {
        if (!hasContact) {
            table.string('contact').nullable();
        }
        if (!hasCustomValues) {
            table.json('custom_values').nullable();
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.table('leads', (table) => {
        table.dropColumn('contact');
        table.dropColumn('custom_values');
    });
    await knex.schema.dropTableIfExists('custom_fields');
};
