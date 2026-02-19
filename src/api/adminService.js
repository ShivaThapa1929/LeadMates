import authService from './authService';

const getAnalytics = async () => {
    try {
        const response = await authService.api.get('/admin/analytics');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
};

const getActivityLogs = async () => {
    try {
        const response = await authService.api.get('/admin/activity-logs');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch activity logs' };
    }
};

const getSettings = async () => {
    try {
        const response = await authService.api.get('/admin/settings');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch settings' };
    }
};

const adminService = {
    getAnalytics,
    getActivityLogs,
    getSettings
};

export default adminService;
