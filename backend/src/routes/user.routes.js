const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, createUser, updateUser, updateAvatar } = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// All user management routes require authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.post('/:id/avatar', upload.single('avatar'), updateAvatar);
router.delete('/:id', deleteUser);

module.exports = router;
