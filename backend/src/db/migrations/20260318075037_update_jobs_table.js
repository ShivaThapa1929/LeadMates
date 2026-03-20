/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // 1. Add new columns to jobs table
    await knex.schema.alterTable('jobs', (table) => {
        table.string('category').nullable().index();
        table.string('job_type').nullable().index(); // e.g. 'Full-time', 'Remote', 'Freelance'
        table.string('status').defaultTo('ACTIVE').index();
    });

    // 2. Create job_applications table
    const exists = await knex.schema.hasTable('job_applications');
    if (!exists) {
        await knex.schema.createTable('job_applications', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.integer('job_id').unsigned().notNullable().references('id').inTable('jobs').onDelete('CASCADE');
            table.string('status').defaultTo('PENDING').index(); // PENDING, ACCEPTED, REJECTED
            
            table.timestamps(true, true);
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('job_applications');
    await knex.schema.alterTable('jobs', (table) => {
        table.dropColumn('category');
        table.dropColumn('job_type');
        table.dropColumn('status');
    });
};
