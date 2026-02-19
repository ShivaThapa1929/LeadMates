const express = require('express');
const router = express.Router();
// Role routes
const {
    getRoles,
    createRole,
    updateRole,
    assignRoleToUser
} = require('../controllers/role.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
// Restrict role management to Super Admin
// View roles: Admin & Super Admin
router.get('/', authorize('Admin', 'Super Admin'), getRoles);

// Manage roles: Super Admin only
router.use(authorize('Super Admin'));
router.post('/', createRole);
router.put('/:id', updateRole);
router.post('/assign-to-user', assignRoleToUser);

module.exports = router;
