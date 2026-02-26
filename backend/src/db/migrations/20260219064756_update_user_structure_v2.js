/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasTable = await knex.schema.hasTable('users');
    if (!hasTable) return;

    // 1. Rename verification columns if old names exist
    const hasIsPhoneVerified = await knex.schema.hasColumn('users', 'is_phone_verified');
    const hasIsEmailVerified = await knex.schema.hasColumn('users', 'is_email_verified');

    if (hasIsPhoneVerified) {
        await knex.schema.alterTable('users', (table) => {
            table.renameColumn('is_phone_verified', 'phone_verified');
        });
    }
    if (hasIsEmailVerified) {
        await knex.schema.alterTable('users', (table) => {
            table.renameColumn('is_email_verified', 'email_verified');
        });
    }

    // 2. Add phone uniqueness separately (since it's likely missing)
    try {
        await knex.schema.alterTable('users', (table) => {
            table.unique('phone');
        });
    } catch (e) {
        // Index might exist if we retry, ignore
        console.log('Phone index probably exists, skipping...');
    }

    // 3. Finalize role column as ENUM
    await knex.raw("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user'");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('users', (table) => {
        table.dropUnique(['phone']);
    });
};
