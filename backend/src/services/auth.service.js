const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenHandler');

class AuthService {
    async getUserWithPermissions(userId) {
        const [roleDetails, user] = await Promise.all([
            User.getRolesWithPermissions(userId),
            User.findById(userId)
        ]);

        // Flatten permissions for frontend easy check
        const permissions = new Set();
        roleDetails.forEach(role => {
            let perms = role.permissions;
            if (typeof perms === 'string') {
                try { perms = JSON.parse(perms); } catch (e) { perms = {}; }
            }
            if (!perms) return;

            Object.entries(perms).forEach(([module, actions]) => {
                // Ensure perms[module] is object
                if (typeof actions !== 'object' || !actions) return;

                Object.entries(actions).forEach(([action, isAllowed]) => {
                    if (isAllowed) {
                        permissions.add(`${module}.${action}`);
                    }
                });
            });
        });

        // Super Admin gets wildcard
        if (roleDetails.some(r => r.name === 'Super Admin')) {
            permissions.add('*');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            roles: roleDetails.map(r => r.name),
            roleDetails,
            permissions: Array.from(permissions),
            is_verified: user.is_verified,
            phone_verified: user.phone_verified,
            email_verified: user.email_verified,
            plan: user.plan,
            role: user.role,
            last_login_at: user.last_login_at
        };
    }

    /**
     * Authenticate user and return tokens + user data
     */
    async login(email, password, info = {}, bypassPassword = false, existingUser = null) {
        let user = existingUser;
        if (!user) {
            user = await User.findByEmail(email);
            if (!user) {
                throw new Error('Invalid credentials');
            }
        }

        if (!bypassPassword) {
            const isMatch = await User.matchPassword(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
        }

        // Update last login
        await User.update(user.id, { last_login_at: new Date() });

        // Log activity
        const { db } = require('../config/db'); // lazy load
        await db('login_activity').insert({
            user_id: user.id,
            ip_address: info.ip || 'unknown',
            user_agent: info.userAgent || 'unknown'
        }).catch(err => console.error('Activity Log Error:', err));

        const accessToken = generateAccessToken(user.id);
        const refreshTokenStr = generateRefreshToken(user.id);

        const userData = await this.getUserWithPermissions(user.id);

        return {
            user: userData,
            accessToken,
            refreshToken: refreshTokenStr
        };
    }

    /**
     * Refresh access token using refresh token
     */
    async refresh(refreshToken) {
        // Since we are NOT storing refresh tokens in DB (stateless), 
        // we just need to verify the JWT and issue a new access token.
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../config/env');

        try {
            const decoded = jwt.verify(refreshToken, JWT_SECRET);
            const accessToken = generateAccessToken(decoded.id);
            const newRefreshToken = generateRefreshToken(decoded.id);
            return { accessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    /**
     * Logout user
     */
    async logout(refreshToken) {
        // Stateless logout - handled by frontend clearing local/cookie storage
        return true;
    }
}

module.exports = new AuthService();
