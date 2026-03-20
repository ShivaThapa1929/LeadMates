/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const exists = await knex.schema.hasTable('offers');
    if (exists) return;

    await knex.schema.createTable('offers', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().index();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.string('category').notNullable();
        table.decimal('price', 12, 2).notNullable();

        table.boolean('is_deleted').defaultTo(false).index();
        table.timestamp('deleted_at').nullable();
        table.integer('deleted_by').unsigned().nullable();

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('offers');
};
