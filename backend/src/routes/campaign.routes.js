const express = require('express');
const router = express.Router();
const { getCampaigns, createCampaign, deleteCampaign, updateCampaign } = require('../controllers/campaign.controller');
const { protect, isPlanActive } = require('../middlewares/auth.middleware');

router.use(protect);
router.use(isPlanActive);

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.patch('/delete/:id', deleteCampaign);

module.exports = router;
