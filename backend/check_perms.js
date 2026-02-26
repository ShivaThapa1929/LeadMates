const { db } = require('./src/config/db');
require('dotenv').config();

async function checkRoles() {
    try {
        const roles = await db('roles').select('*');
        console.log('Roles:', JSON.stringify(roles, null, 2));

        const perms = await db('permissions').select('*');
        console.log('Permissions:', JSON.stringify(perms, null, 2));

        const rolePerms = await db('role_permissions')
            .join('roles', 'role_permissions.role_id', 'roles.id')
            .join('permissions', 'role_permissions.permission_id', 'permissions.id')
            .select('roles.name as role', 'permissions.module', 'permissions.action');
        console.log('Role Permissions:', JSON.stringify(rolePerms, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkRoles();
