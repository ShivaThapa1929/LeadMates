/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('users', table => {
        // Only if they don't exist
        table.string('plan_status').defaultTo('pending'); // 'pending', 'active', 'expired'
        table.string('payment_status').defaultTo('pending'); // 'pending', 'success', 'failed'
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('users', table => {
        table.dropColumn('plan_status');
        table.dropColumn('payment_status');
    });
};
