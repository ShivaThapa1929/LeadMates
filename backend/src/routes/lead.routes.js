const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead, getLead, getAnalysis } = require('../controllers/lead.controller');
const { protect, hasPermission } = require('../middlewares/auth.middleware');

// All lead routes are protected
router.use(protect);

router.route('/')
    .get(hasPermission('leads', 'view'), getLeads)
    .post(hasPermission('leads', 'create'), createLead);

router.get('/analysis', hasPermission('analytics', 'view'), getAnalysis);

router.route('/:id')
    .get(hasPermission('leads', 'view'), getLead)
    .put(hasPermission('leads', 'update'), updateLead)
    .delete(hasPermission('leads', 'delete'), deleteLead)
    .patch(hasPermission('leads', 'delete'), deleteLead);

module.exports = router;
