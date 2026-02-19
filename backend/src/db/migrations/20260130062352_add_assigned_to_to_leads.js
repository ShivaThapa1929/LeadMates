/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('leads');
    if (!exists) return;

    return knex.schema.table('leads', function (table) {
        table.integer('assigned_to').unsigned().references('id').inTable('users').onDelete('SET NULL');
        table.text('notes').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('leads', function (table) {
        table.dropColumn('assigned_to');
        table.dropColumn('notes');
    });
};
