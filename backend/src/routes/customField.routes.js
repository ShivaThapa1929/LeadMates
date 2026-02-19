const express = require('express');
const router = express.Router();
const CustomFieldController = require('../controllers/customField.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', CustomFieldController.getCustomFields);

// Only administrators can create or delete custom fields
router.post('/', authorize('Admin'), CustomFieldController.createCustomField);
router.delete('/:id', authorize('Admin'), CustomFieldController.deleteCustomField);

module.exports = router;
