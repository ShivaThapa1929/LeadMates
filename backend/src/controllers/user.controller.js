const User = require('../models/user.model');
const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
    try {
        const { status, search } = req.query;
        const users = await User.findAll({ status, search });
        sendSuccess(res, users, 'Users fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return sendError(res, 'User with this email already exists', 400);
        }

        // 2. Prepare user data
        const userData = {
            name,
            email,
            password,
            phone: '0000000000', // Default
            businessName: 'LeadMates Team', // Default
            is_verified: true
        };

        const newUser = await User.create(userData);

        // 3. Assign role
        const roleName = role || 'User';
        const rolesInDb = await User.getAvailableRoles();
        const roleObj = rolesInDb.find(r => r.name === roleName);

        if (roleObj) {
            await User.assignRole(newUser.id, roleObj.id);
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;
        sendSuccess(res, { ...userWithoutPassword, role: roleName }, 'User created successfully', 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Check if Admin is trying to delete themselves
        if (req.user.id == userId) {
            return sendError(res, 'Security Breach: You cannot delete your own Administrator account.', 400);
        }

        // 2. Already checked by authorize middleware in routes, but extra safety
        const isAdmin = req.user.roles.includes('Admin') || req.user.roles.includes('Super Admin');
        if (!isAdmin) {
            return sendError(res, 'Access Denied: Only users with Administrator privileges can perform this action.', 403);
        }

        // 3. Check if user exists and is NOT already deleted
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return sendError(res, 'User not found or has already been decommissioned.', 404);
        }

        // 4. Perform Hard Delete
        await User.delete(userId);

        sendSuccess(res, null, 'User permanently deleted.');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!req.file) {
            return sendError(res, 'Please upload an image file.', 400);
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        await User.update(userId, { avatar: avatarPath });

        const userData = await authService.getUserWithPermissions(userId);

        sendSuccess(res, {
            user: userData,
            avatar: avatarPath
        }, 'User profile picture updated successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, role, phone, businessName, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (businessName) updateData.business_name = businessName;
        if (password) updateData.password = password;

        await User.update(userId, updateData);

        // Update role if provided
        if (role) {
            const rolesInDb = await User.getAvailableRoles();
            const roleObj = rolesInDb.find(r => r.name === role);
            if (roleObj) {
                // Remove all existing roles first (assuming 1 role for simplicity in this UI)
                await db('user_roles').where({ user_id: userId }).del();
                await User.assignRole(userId, roleObj.id);
            }
        }

        const updatedUser = await User.findById(userId);
        const userRoles = await User.getRoles(userId);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser;

        sendSuccess(res, { ...userWithoutPassword, role: userRoles[0] }, 'User updated successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};
