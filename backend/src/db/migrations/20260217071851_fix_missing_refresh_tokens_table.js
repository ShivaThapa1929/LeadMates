/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('refresh_tokens');
    if (!exists) {
        await knex.schema.createTable('refresh_tokens', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('token', 511).notNullable().unique();
            table.timestamp('expires_at').notNullable();
            table.timestamps(true, true);
        });
        console.log('[MIGRATION] Created missing refresh_tokens table.');
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('refresh_tokens');
};
