
require('dotenv').config({ path: __dirname + '/../.env' });
const { db } = require('../src/config/db');

async function setupSuperAdmin() {
    try {
        console.log('Checking Super Admin role...');

        // 1. Ensure Super Admin role exists
        let superAdminRole = await db('roles').where({ name: 'Super Admin' }).first();
        if (!superAdminRole) {
            console.log('Creating Super Admin role...');
            const [id] = await db('roles').insert({
                name: 'Super Admin',
                description: 'Full system access',
                permissions: JSON.stringify({}), // Super Admin has implicit full access
                status: 'active'
            });
            superAdminRole = { id };
        } else {
            console.log('Super Admin role exists.');
        }

        // 2. Assign to founder@leadmates.com
        const email = 'founder@leadmates.com';
        const user = await db('users').where({ email }).first();

        if (user) {
            const hasRole = await db('user_roles').where({
                user_id: user.id,
                role_id: superAdminRole.id
            }).first();

            if (!hasRole) {
                console.log(`Assigning Super Admin role to ${email}...`);
                await db('user_roles').insert({
                    user_id: user.id,
                    role_id: superAdminRole.id
                });
                console.log('Role assigned.');
            } else {
                console.log(`User ${email} already has Super Admin role.`);
            }
        } else {
            console.log(`User ${email} not found.`);
        }

    } catch (error) {
        console.error('Error setting up Super Admin:', error);
    } finally {
        process.exit();
    }
}

setupSuperAdmin();
