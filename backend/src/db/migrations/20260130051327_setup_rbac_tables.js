/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Clean up existing tables if they exist to ensure consistent state
    await knex.schema.dropTableIfExists('user_roles');
    await knex.schema.dropTableIfExists('role_permissions');
    await knex.schema.dropTableIfExists('refresh_tokens');
    await knex.schema.dropTableIfExists('permissions');
    await knex.schema.dropTableIfExists('roles');

    return knex.schema
        .createTable('roles', table => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.string('description');
            table.timestamps(true, true);
        })
        .createTable('permissions', table => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.string('description');
            table.timestamps(true, true);
        })
        .createTable('role_permissions', table => {
            table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
            table.integer('permission_id').unsigned().notNullable().references('id').inTable('permissions').onDelete('CASCADE');
            table.primary(['role_id', 'permission_id']);
        })
        .createTable('user_roles', table => {
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
            table.primary(['user_id', 'role_id']);
        })
        .createTable('refresh_tokens', table => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('token', 511).notNullable().unique();
            table.timestamp('expires_at').notNullable();
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('refresh_tokens')
        .dropTableIfExists('user_roles')
        .dropTableIfExists('role_permissions')
        .dropTableIfExists('permissions')
        .dropTableIfExists('roles');
};
