/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('job_applications', (table) => {
        table.string('full_name').nullable();
        table.string('email').nullable();
        table.string('phone').nullable();
        table.string('resume_url').nullable();
        table.text('cover_letter').nullable();
        table.text('skills').nullable();
        
        // Prevent duplicate applications
        table.unique(['user_id', 'job_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('job_applications', (table) => {
        table.dropUnique(['user_id', 'job_id']);
        table.dropColumn('full_name');
        table.dropColumn('email');
        table.dropColumn('phone');
        table.dropColumn('resume_url');
        table.dropColumn('cover_letter');
        table.dropColumn('skills');
    });
};
