/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Leads Table (Base)
    if (!(await knex.schema.hasTable('leads'))) {
        await knex.schema.createTable('leads', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable(); // Removed reference to avoid circular or missing user table issues if run too early, will be added in later migrations or we assume users exists if run normally
            table.string('name').notNullable();
            table.string('email').nullable();
            table.string('phone').notNullable();
            table.string('channel').notNullable().defaultTo('Social / FB Ads');
            table.enum('status', ['NEW', 'CONTACTED', 'SUSPECTED', 'CONVERTED']).defaultTo('NEW');
            table.timestamp('deleted_at').nullable();
            table.timestamps(true, true);
        });
    }

    // 2. Campaigns Table
    if (!(await knex.schema.hasTable('campaigns'))) {
        await knex.schema.createTable('campaigns', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('name').notNullable();
            table.enum('status', ['ACTIVE', 'PAUSED', 'COMPLETED']).defaultTo('ACTIVE');
            table.timestamps(true, true);
        });
    }

    // 3. Projects Table
    if (!(await knex.schema.hasTable('projects'))) {
        await knex.schema.createTable('projects', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('name').notNullable();
            table.string('description').nullable();
            table.enum('status', ['PLANNING', 'IN_PROGRESS', 'COMPLETED']).defaultTo('PLANNING');
            table.timestamps(true, true);
        });
    }

    // 4. Suspects Table
    if (!(await knex.schema.hasTable('suspects'))) {
        await knex.schema.createTable('suspects', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('name').notNullable();
            table.timestamps(true, true);
        });
    }

    // 5. Login Sessions Table
    if (!(await knex.schema.hasTable('login_sessions'))) {
        await knex.schema.createTable('login_sessions', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.string('ip_address', 45).nullable();
            table.text('user_agent').nullable();
            table.timestamp('last_activity').defaultTo(knex.fn.now());
            table.timestamps(true, true);
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('login_sessions');
    await knex.schema.dropTableIfExists('suspects');
    await knex.schema.dropTableIfExists('projects');
    await knex.schema.dropTableIfExists('campaigns');
    await knex.schema.dropTableIfExists('leads');
};
