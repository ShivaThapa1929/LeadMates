const express = require('express');
const router = express.Router();
const TrashController = require('../controllers/trash.controller');
const { protect, hasPermission } = require('../middlewares/auth.middleware');

// All trash routes are protected and requires specific roles
router.use(protect);

// Admin and Sub-admin can view trash and restore
router.get('/', TrashController.getTrash);
router.patch('/restore/:module/:id', TrashController.restoreItem);

// Only Admin can permanently delete
router.delete('/permanent/:module/:id', TrashController.permanentDelete);

module.exports = router;
