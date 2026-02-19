/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('users', table => {
        table.string('plan').defaultTo('Identity Basic');
        table.string('role_type').defaultTo('user'); // admin or user (to track which pricing plans they see)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('users', table => {
        table.dropColumn('plan');
        table.dropColumn('role_type');
    });
};
