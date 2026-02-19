const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { sendError } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');

/**
 * @desc    Validate request bodies based on express-validator rules
 */
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));
        return sendError(res, 'Validation Error', 400, formattedErrors);
    }
    next();
};

/**
 * @desc    Protect routes - Verify JWT Token and attach user to request
 */
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendError(res, 'Not authorized. No token provided.', 401);
    }

    try {
        // 1. Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 2. Get user with full permissions from service (handles flattening)
        const user = await authService.getUserWithPermissions(decoded.id);

        if (!user) {
            return sendError(res, 'Session expired. User no longer exists.', 401);
        }

        if (!user.is_verified) {
            return sendError(res, 'Account not verified.', 403, { errorCode: 'NOT_VERIFIED' });
        }

        // 3. Attach user to request object
        req.user = user;

        // 4. Update last_login_at (effectively tracking last active time)
        // We use a non-waiting call to avoid blocking the response
        const { db } = require('../config/db');
        db('users').where({ id: user.id }).update({ last_login_at: db.fn.now() }).catch(err => console.error('Failed to update activity', err));

        next();
    } catch (err) {
        console.error('❌ JWT_AUTH_ERROR:', err.message, '| Path:', req.originalUrl);
        return sendError(res, 'Not authorized. Invalid or expired token.', 401);
    }
};

/**
 * @desc    Restrict access to specific roles
 * @param   {...String} roles - Allowed roles
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        const hasRole = req.user.roles.some(role => roles.includes(role));
        if (!hasRole) {
            return sendError(res, `Forbidden: You do not have the required role to access this route.`, 403);
        }
        next();
    };
};

/**
 * @desc    Check permissions for a module and action
 * @param   {String} moduleName - Module name (e.g., 'users', 'leads')
 * @param   {String} action - Action (e.g., 'view', 'create')
 */
exports.hasPermission = (moduleName, action) => {
    return (req, res, next) => {
        // Super Admin has full access
        if (req.user.roles.includes('Super Admin') || req.user.roles.includes('Admin')) {
            return next();
        }

        const hasPerm = req.user.roleDetails.some(role => {
            let perms = role.permissions;
            // Handle if JSON is returned as string
            if (typeof perms === 'string') {
                try { perms = JSON.parse(perms); } catch (e) { perms = {}; }
            }
            if (!perms) return false;

            // normalized module name to lowercase
            const mod = moduleName.toLowerCase();
            return perms[mod] && perms[mod][action] === true;
        });

        if (!hasPerm) {
            return sendError(res, `Forbidden: You do not have permission to ${action} ${moduleName}.`, 403);
        }
        next();
    };
};
