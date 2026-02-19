/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('users', (table) => {
        table.timestamp('last_login_at').nullable();
    });

    await knex.schema.createTable('login_activity', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('ip_address').nullable();
        table.string('user_agent').nullable();
        table.timestamp('logged_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('login_activity');
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('last_login_at');
    });
};
