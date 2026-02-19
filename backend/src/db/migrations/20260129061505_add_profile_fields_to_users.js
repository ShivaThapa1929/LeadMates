/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('users');
    if (!exists) return;

    return knex.schema.alterTable('users', (table) => {
        table.string('phone');
        table.string('business_name');
        table.string('website');
        table.string('experience');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('phone');
        table.dropColumn('business_name');
        table.dropColumn('website');
        table.dropColumn('experience');
    });
};
