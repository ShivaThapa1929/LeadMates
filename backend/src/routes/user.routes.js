const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, createUser, updateUser, updateAvatar } = require('../controllers/user.controller');
const { protect, hasPermission } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(protect);
router.use(hasPermission('manage_users'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.post('/:id/avatar', upload.single('avatar'), updateAvatar);
router.delete('/:id', deleteUser);
router.patch('/delete/:id', deleteUser);

module.exports = router;
