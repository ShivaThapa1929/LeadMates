/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // MySQL specific raw query to alter enum column
    await knex.raw("ALTER TABLE otps MODIFY COLUMN type ENUM('email', 'mobile', 'login') NOT NULL");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Revert to original enum values
    // Note: If 'login' records exist, this might fail or truncate data. 
    // Usually safe in dev if we delete login otps first.
    await knex('otps').where('type', 'login').del();
    await knex.raw("ALTER TABLE otps MODIFY COLUMN type ENUM('email', 'mobile') NOT NULL");
};
