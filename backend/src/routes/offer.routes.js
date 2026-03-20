const express = require('express');
const router = express.Router();

const { createOffer, getOffers } = require('../controllers/offer.controller');
const { protect } = require('../middlewares/auth.middleware');

// All offer routes are protected
router.use(protect);

// GET /api/offers
router.get('/', getOffers);

// POST /api/offers/post-offer
router.post('/post-offer', createOffer);

module.exports = router;
