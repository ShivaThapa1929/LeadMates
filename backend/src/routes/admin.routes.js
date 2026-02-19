const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { getAdminAnalytics, getSystemSettings, getActivityLogs } = require('../controllers/admin.controller');

/**
 * Admin Routes
 * Base path: /api/admin
 */

// All routes here require Admin role
router.use(protect);
router.use(authorize('Admin'));

// User Management
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// System Monitoring & Settings
router.get('/analytics', getAdminAnalytics);
router.get('/settings', getSystemSettings);
router.get('/activity-logs', getActivityLogs);

module.exports = router;
