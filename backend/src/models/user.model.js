const { db } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Handles all database operations for users using Knex.js
 */
const User = {
    tableName: 'users',

    findByEmail: async (email) => {
        return await db(User.tableName).where({ email, is_deleted: false }).first();
    },

    /**
     * @desc Find user by phone
     */
    findByPhone: async (phone) => {
        return await db(User.tableName).where({ phone, is_deleted: false }).first();
    },

    /**
     * @desc Find user by id
     */
    findById: async (id) => {
        return await db(User.tableName).where({ id, is_deleted: false }).first();
    },

    /**
     * @desc Create new user with secure password hashing
     */
    create: async (userData) => {
        const { password, name, email, phone, businessName, website, experience } = userData;

        // Hash password before storing in database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return await db.transaction(async (trx) => {
            const [userId] = await trx(User.tableName).insert({
                name,
                email,
                phone,
                business_name: businessName,
                website,
                experience,
                password: hashedPassword,
                is_verified: false,
                email_verified: false,
                phone_verified: false,
                role: userData.role || 'user',
                plan: userData.plan || (userData.role === 'admin' ? 'Starter Node' : 'Identity Basic')
            });

            // Assign proper RBAC role based on the role column
            const targetRoleName = (userData.role === 'admin') ? 'Admin' : 'User';
            const targetRole = await trx('roles').where({ name: targetRoleName }).first();

            if (targetRole) {
                await trx('user_roles').insert({
                    user_id: userId,
                    role_id: targetRole.id
                });
            }

            return await trx(User.tableName).where({ id: userId }).first();
        });
    },

    /**
     * @desc Compare entered password with hashed password
     */
    matchPassword: async (enteredPassword, hashedPassword) => {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    },

    /**
     * @desc Find all users (excluding sensitive data)
     */
    findAll: async (filters = {}) => {
        let query = db(User.tableName)
            .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
            .leftJoin('roles', 'user_roles.role_id', 'roles.id')
            .where('users.is_deleted', false)
            .select('users.id', 'users.name', 'users.email', 'users.phone', 'roles.name as role_name', 'users.role', 'users.plan', 'users.is_verified', 'users.created_at', 'users.last_login_at');

        if (filters.status === 'verified') {
            query.where('users.is_verified', true);
        } else if (filters.status === 'pending') {
            query.where('users.is_verified', false);
        }

        if (filters.search) {
            query.where((q) => {
                q.where('users.name', 'like', `%${filters.search}%`)
                    .orWhere('users.email', 'like', `%${filters.search}%`)
                    .orWhere('users.phone', 'like', `%${filters.search}%`);
            });
        }

        const rows = await query;

        const usersMap = new Map();
        rows.forEach(row => {
            if (!usersMap.has(row.id)) {
                usersMap.set(row.id, {
                    ...row,
                    role: row.role_name, // Primary/first role
                    roles: []
                });
            }
            if (row.role_name) {
                const user = usersMap.get(row.id);
                if (!user.roles.includes(row.role_name)) {
                    user.roles.push(row.role_name);
                }
            }
        });

        return Array.from(usersMap.values()).map(u => ({
            ...u,
            role: u.roles.join(', ') || u.role
        }));
    },

    /**
     * @desc Get user roles
     */
    getRoles: async (userId) => {
        const roles = await db('roles')
            .join('user_roles', 'roles.id', 'user_roles.role_id')
            .where('user_roles.user_id', userId)
            .select('roles.name');
        return roles.map(r => r.name);
    },

    /**
     * @desc Get user roles with full details (including permissions)
     */
    getRolesWithPermissions: async (userId) => {
        return await db('roles')
            .join('user_roles', 'roles.id', 'user_roles.role_id')
            .where('user_roles.user_id', userId)
            .select('roles.*');
    },

    /**
     * @desc Assign role to user
     */
    assignRole: async (userId, roleId) => {
        // Check if already assigned
        const exists = await db('user_roles').where({ user_id: userId, role_id: roleId }).first();
        if (exists) return true;

        return await db('user_roles').insert({
            user_id: userId,
            role_id: roleId
        });
    },

    /**
     * @desc Update user details with optional password hashing
     */
    update: async (id, updateData) => {
        const data = { ...updateData };

        // If password is being updated, hash it before storing
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        return await db(User.tableName).where({ id }).update(data);
    },

    /**
     * @desc Get all available roles in system
     */
    getAvailableRoles: async () => {
        return await db('roles').select('id', 'name');
    },

    /**
     * @desc Mark email as verified
     */
    markEmailVerified: async (id) => {
        return await db(User.tableName).where({ id }).update({ email_verified: true });
    },

    /**
     * @desc Mark mobile as verified
     */
    markMobileVerified: async (id) => {
        return await db(User.tableName).where({ id }).update({ phone_verified: true });
    },

    /**
     * @desc Mark user as fully verified
     */
    markVerified: async (id) => {
        return await db(User.tableName).where({ id }).update({ is_verified: true });
    },

    /**
     * @desc Hard delete user
     */
    delete: async (id) => {
        return await db(User.tableName)
            .where({ id })
            .del();
    }
};

module.exports = User;
