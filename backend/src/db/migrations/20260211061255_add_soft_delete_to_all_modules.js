/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const modules = ['leads', 'campaigns', 'projects', 'users'];

    for (const module of modules) {
        await knex.schema.table(module, (table) => {
            // Check columns existence manually as knex doesn't have a built-in ifNotExists for columns in some versions
            // But we can use hasColumn to check
        });

        const hasIsDeleted = await knex.schema.hasColumn(module, 'is_deleted');
        const hasDeletedAt = await knex.schema.hasColumn(module, 'deleted_at');
        const hasDeletedBy = await knex.schema.hasColumn(module, 'deleted_by');

        await knex.schema.table(module, (table) => {
            if (!hasIsDeleted) {
                table.boolean('is_deleted').defaultTo(false).index();
            }
            if (!hasDeletedAt) {
                table.timestamp('deleted_at').nullable();
            }
            if (!hasDeletedBy) {
                table.integer('deleted_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
            }
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const modules = ['leads', 'campaigns', 'projects', 'users'];

    for (const module of modules) {
        await knex.schema.table(module, (table) => {
            table.dropColumn('is_deleted');
            table.dropColumn('deleted_by');
            // We should only drop deleted_at if it wasn't there before this migration, 
            // but for simplicity in this CRM, we'll keep it for users and leads if they had it.
            // Actually leads and users had it.
            if (module !== 'users' && module !== 'leads') {
                table.dropColumn('deleted_at');
            }
        });
    }
};
