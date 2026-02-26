const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, updateAvatar } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { getAdminAnalytics, getSystemSettings, getActivityLogs } = require('../controllers/admin.controller');
const upload = require('../middlewares/upload.middleware');

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
router.post('/users/:id/avatar', upload.single('avatar'), updateAvatar);

// System Monitoring & Settings
router.get('/analytics', getAdminAnalytics);
router.get('/settings', getSystemSettings);
router.get('/activity-logs', getActivityLogs);

module.exports = router;
