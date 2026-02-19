const { db } = require('../src/config/db');
const User = require('../src/models/user.model');

async function testUpdate() {
    try {
        console.log('🔍 Listing all users...');
        const users = await db('users').select('id', 'name', 'email', 'role');
        console.table(users);

        for (const user of users) {
            const roles = await User.getRoles(user.id);
            console.log(`User ${user.email} has RBAC roles: ${roles.join(', ')}`);
        }

    } catch (error) {
        console.error('❌ TEST FAILED with error:', error);
    } finally {
        process.exit();
    }
}

testUpdate();
