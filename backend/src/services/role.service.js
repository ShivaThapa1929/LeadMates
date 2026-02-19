const Role = require('../models/role.model');
const User = require('../models/user.model');

class RoleService {
    async getAllRoles() {
        return await Role.findAll();
    }

    async createRole(data) {
        return await Role.create(data);
    }

    async updateRole(id, data) {
        return await Role.update(id, data);
    }

    async assignRoleToUser(userId, roleId) {
        return await User.assignRole(userId, roleId);
    }
}

module.exports = new RoleService();
