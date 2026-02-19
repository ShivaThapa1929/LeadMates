const roleService = require('../services/role.service');
const Permission = require('../models/permission.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getRoles = async (req, res) => {
    try {
        const roles = await roleService.getAllRoles();
        sendSuccess(res, roles, 'Roles fetched successfully');
    } catch (error) {
        sendError(res, 'Error fetching roles');
    }
};

exports.createRole = async (req, res) => {
    try {
        const role = await roleService.createRole(req.body);
        sendSuccess(res, role, 'Role created successfully', 201);
    } catch (error) {
        sendError(res, 'Error creating role');
    }
};

exports.updateRole = async (req, res) => {
    try {
        await roleService.updateRole(req.params.id, req.body);
        sendSuccess(res, null, 'Role updated successfully');
    } catch (error) {
        sendError(res, 'Error updating role');
    }
};

exports.assignRoleToUser = async (req, res) => {
    try {
        await roleService.assignRoleToUser(req.body.userId, req.body.roleId);
        sendSuccess(res, null, 'Role assigned to user successfully');
    } catch (error) {
        sendError(res, 'Error assigning role to user');
    }
};
