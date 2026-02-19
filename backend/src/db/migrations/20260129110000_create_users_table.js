/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('users');
    if (!exists) {
        return knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('phone');
            table.string('business_name');
            table.string('website');
            table.string('experience'); // Industry/Sector as labeled in UI
            table.string('password').notNullable();
            table.enum('role', ['admin', 'user']).defaultTo('user');
            table.boolean('is_verified').defaultTo(false);
            table.timestamps(true, true);

            table.index('email');
            table.index('role');
        });
    } else {
        // Table exists, handle migration from old schema to new requested schema

        // 1. Handle Role ENUM change
        await knex.raw("ALTER TABLE users MODIFY COLUMN role VARCHAR(255)");
        await knex('users').update({ role: 'admin' }).where('role', 'Admin');
        await knex('users').update({ role: 'user' }).whereNotIn('role', ['admin', 'Admin']);
        await knex.raw("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user') DEFAULT 'user'");

        // 2. Add missing columns
        // Check column existence outside the callback
        const hasIsVerified = await knex.schema.hasColumn('users', 'is_verified');
        const hasPhone = await knex.schema.hasColumn('users', 'phone');
        const hasBusinessName = await knex.schema.hasColumn('users', 'business_name');
        const hasWebsite = await knex.schema.hasColumn('users', 'website');
        const hasExperience = await knex.schema.hasColumn('users', 'experience');

        await knex.schema.alterTable('users', (t) => {
            if (!hasIsVerified) t.boolean('is_verified').defaultTo(false);
            if (!hasPhone) t.string('phone');
            if (!hasBusinessName) t.string('business_name');
            if (!hasWebsite) t.string('website');
            if (!hasExperience) t.string('experience');
        });

        return Promise.resolve();
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};
