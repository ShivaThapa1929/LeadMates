const { sendSuccess, sendError } = require('../utils/responseHandler');
const User = require('../models/user.model');
const Lead = require('../models/lead.model');
const Campaign = require('../models/campaign.model');

/**
 * @desc    Get system-wide analytics for Admin
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
exports.getAdminAnalytics = async (req, res) => {
    try {
        const allUsers = await User.findAll();
        const stats = {
            totalUsers: allUsers.length,
            verifiedUsers: allUsers.filter(u => u.is_verified).length,
            pendingVerification: allUsers.filter(u => !u.is_verified).length,
            totalLeads: (await Lead.findAll()).length,
            activeCampaigns: (await Campaign.findAll()).length,
            systemHealth: 'Optimal',
            lastSync: new Date().toISOString()
        };
        sendSuccess(res, stats, 'Admin analytics fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * @desc    Get system settings
 * @route   GET /api/admin/settings
 * @access  Private (Admin)
 */
exports.getSystemSettings = async (req, res) => {
    try {
        const settings = {
            maintenanceMode: false,
            registrationEnabled: true,
            defaultUserRole: 'User',
            maxLeadScore: 100
        };
        sendSuccess(res, settings, 'System settings fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * @desc    Get activity logs
 * @route   GET /api/admin/activity-logs
 * @access  Private (Admin)
 */
exports.getActivityLogs = async (req, res) => {
    try {
        const { db } = require('../config/db');
        const logs = await db('login_activity')
            .join('users', 'login_activity.user_id', 'users.id')
            .select(
                'login_activity.id',
                'users.name as user',
                'login_activity.ip_address',
                'login_activity.logged_at as timestamp'
            )
            .orderBy('login_activity.logged_at', 'desc')
            .limit(10);

        const formattedLogs = logs.map(log => ({
            ...log,
            action: 'USER_LOGIN',
            desc: `Logged in from ${log.ip_address || 'unknown'}`
        }));

        sendSuccess(res, formattedLogs, 'Activity logs fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};
