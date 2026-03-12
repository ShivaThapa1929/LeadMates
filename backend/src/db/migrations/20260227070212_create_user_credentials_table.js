/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('user_credentials', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().unique()
            .references('id').inTable('users').onDelete('CASCADE');
        table.string('password_hash').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    // Migrate existing passwords
    const users = await knex('users').select('id', 'password').whereNotNull('password');
    if (users.length > 0) {
        const credentials = users.map(user => ({
            user_id: user.id,
            password_hash: user.password,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        }));
        await knex('user_credentials').insert(credentials);
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user_credentials');
};
