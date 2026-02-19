const { db } = require('../src/config/db');

async function fixDatabase() {
    try {
        console.log('Checking users table for avatar column...');
        const hasColumn = await db.schema.hasColumn('users', 'avatar');

        if (!hasColumn) {
            console.log('Avatar column missing. Adding it manually...');
            await db.schema.table('users', table => {
                table.string('avatar').nullable().defaultTo(null);
            });
            console.log('✅ Avatar column added successfully.');
        } else {
            console.log('ℹ️ Avatar column already exists.');
        }
    } catch (error) {
        console.error('❌ Error fixing database:', error);
    } finally {
        process.exit();
    }
}

fixDatabase();
