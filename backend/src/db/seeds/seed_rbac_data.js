/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Order matters because of foreign key constraints
  await knex('user_roles').del();
  await knex('role_permissions').del();
  await knex('refresh_tokens').del();
  await knex('permissions').del();
  await knex('roles').del();

  // Insert permissions
  const permissions = [
    { name: 'create_lead', description: 'Can create new leads' },
    { name: 'view_lead', description: 'Can view lead details' },
    { name: 'update_lead', description: 'Can update lead information' },
    { name: 'delete_lead', description: 'Can delete leads' },
    { name: 'manage_users', description: 'Can manage user accounts and roles' },
    { name: 'view_reports', description: 'Can view analytical reports' },
  ];
  await knex('permissions').insert(permissions);

  // Insert roles
  const roles = [
    { name: 'Admin', description: 'Full system access' },
    { name: 'Manager', description: 'Management access' },
    { name: 'Sales', description: 'Sales representative access' },
    { name: 'User', description: 'Standard user access' },
  ];
  await knex('roles').insert(roles);

  // Get IDs
  const allPermissions = await knex('permissions').select('id', 'name');
  const allRoles = await knex('roles').select('id', 'name');

  const getPermId = (name) => allPermissions.find(p => p.name === name).id;
  const getRoleId = (name) => allRoles.find(r => r.name === name).id;

  // Assign permissions to roles
  const rolePermissions = [
    // Admin gets everything
    ...allPermissions.map(p => ({ role_id: getRoleId('Admin'), permission_id: p.id })),

    // Manager
    { role_id: getRoleId('Manager'), permission_id: getPermId('create_lead') },
    { role_id: getRoleId('Manager'), permission_id: getPermId('view_lead') },
    { role_id: getRoleId('Manager'), permission_id: getPermId('update_lead') },
    { role_id: getRoleId('Manager'), permission_id: getPermId('view_reports') },

    // Sales
    { role_id: getRoleId('Sales'), permission_id: getPermId('create_lead') },
    { role_id: getRoleId('Sales'), permission_id: getPermId('view_lead') },
    { role_id: getRoleId('Sales'), permission_id: getPermId('update_lead') },

    // User
    { role_id: getRoleId('User'), permission_id: getPermId('view_lead') },
  ];
  await knex('role_permissions').insert(rolePermissions);

  // Map existing users from the 'users' table to the new 'user_roles' table
  const users = await knex('users').select('id', 'role');
  if (users.length > 0) {
    const userRolesToInsert = users.map(user => {
      let roleName = 'User';
      // Case insensitive check and mapping
      const currentRole = (user.role || '').toLowerCase();
      if (currentRole === 'admin') roleName = 'Admin';
      else if (currentRole === 'manager') roleName = 'Manager';
      else if (currentRole === 'sales') roleName = 'Sales';

      return {
        user_id: user.id,
        role_id: getRoleId(roleName)
      };
    });
    await knex('user_roles').insert(userRolesToInsert);
  }
};
