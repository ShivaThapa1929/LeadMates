const { db } = require('./src/config/db');

async function addSoftDeleteColumns() {
    const tables = ['leads', 'campaigns', 'projects', 'users'];

    for (const table of tables) {
        try {
            const hasColumn = await db.schema.hasColumn(table, 'is_deleted');
            if (!hasColumn) {
                await db.schema.table(table, (t) => {
                    t.boolean('is_deleted').defaultTo(false);
                    t.timestamp('deleted_at').nullable();
                    t.integer('deleted_by').unsigned().nullable().references('id').inTable('users');
                });
                console.log(`Added soft delete columns to ${table}`);
            } else {
                console.log(`Soft delete columns already exist in ${table}`);
            }
        } catch (error) {
            console.error(`Error altering table ${table}:`, error.message);
        }
    }

    process.exit();
}

addSoftDeleteColumns();
