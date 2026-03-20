const Offer = require('../models/offer.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get offers (admin: all, user: own)
// @route   GET /api/offers
// @access  Private
exports.getOffers = async (req, res) => {
    try {
        const isAdmin = req.user.roles?.includes('Admin') || req.user.roles?.includes('Super Admin');
        const offers = isAdmin ? await Offer.findAll() : await Offer.findUserOffers(req.user.id);
        return sendSuccess(res, offers, 'Offers fetched successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Create a new offer
// @route   POST /api/offers/post-offer
// @access  Private
exports.createOffer = async (req, res) => {
    try {
        const { title, description, category, price } = req.body;

        if (!title || !description || !category || price === undefined || price === null || String(price).trim() === '') {
            return sendError(res, 'All fields are required (title, description, category, price)', 400);
        }

        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return sendError(res, 'Price must be a valid non-negative number', 400);
        }

        const offer = await Offer.create({
            user_id: req.user.id,
            title: String(title).trim(),
            description: String(description).trim(),
            category: String(category).trim(),
            price: numericPrice
        });

        return sendSuccess(res, offer, 'Offer posted successfully', 201);
    } catch (error) {
        return sendError(res, error.message);
    }
};
