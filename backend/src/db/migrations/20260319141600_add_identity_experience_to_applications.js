/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('job_applications', (table) => {
        table.string('aadhaar_number', 12).nullable();        // 12-digit ID
        table.json('experience_details').nullable();           // [{company, role, duration}]
        table.json('internship_details').nullable();           // [{company, role, duration}]
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('job_applications', (table) => {
        table.dropColumn('aadhaar_number');
        table.dropColumn('experience_details');
        table.dropColumn('internship_details');
    });
};
