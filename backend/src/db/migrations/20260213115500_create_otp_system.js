/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Create otp_logs table
    await knex.schema.createTable('otp_logs', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('otp_code').notNullable();
        table.enum('type', ['email', 'mobile']).notNullable();
        table.timestamp('expires_at').notNullable();
        table.boolean('is_used').defaultTo(false);
        table.timestamps(true, true);

        table.index(['user_id', 'type']);
    });

    // Add verification columns to users table
    await knex.schema.alterTable('users', (table) => {
        table.boolean('is_email_verified').defaultTo(false);
        table.boolean('is_mobile_verified').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Drop verification columns
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('is_email_verified');
        table.dropColumn('is_mobile_verified');
    });

    // Drop otp_logs table
    await knex.schema.dropTableIfExists('otp_logs');
};
