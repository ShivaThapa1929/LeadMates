/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const hasTable = await knex.schema.hasTable('otps');
    if (!hasTable) return;

    await knex.schema.alterTable('otps', (table) => {
        // 1. Rename otp_hash to otp_code (staying as varchar for hashed storage)
        const hasOtpHash = knex.schema.hasColumn('otps', 'otp_hash');
        if (hasOtpHash) {
            table.renameColumn('otp_hash', 'otp_code');
        }

        // 2. Rename attempts to attempt_count
        const hasAttempts = knex.schema.hasColumn('otps', 'attempts');
        if (hasAttempts) {
            table.renameColumn('attempts', 'attempt_count');
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const hasTable = await knex.schema.hasTable('otps');
    if (!hasTable) return;

    await knex.schema.alterTable('otps', (table) => {
        table.renameColumn('otp_code', 'otp_hash');
        table.renameColumn('attempt_count', 'attempts');
    });
};
