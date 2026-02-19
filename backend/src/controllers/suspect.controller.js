const Suspect = require('../models/suspect.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getSuspects = async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');
        let suspects;

        if (isAdmin) {
            suspects = await Suspect.findAll();
        } else {
            suspects = await Suspect.findAllByUserId(req.user.id);
        }
        sendSuccess(res, suspects, 'Suspects fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.createSuspect = async (req, res) => {
    try {
        const { name } = req.body;
        const suspect = await Suspect.create({
            user_id: req.user.id,
            name
        });
        sendSuccess(res, suspect, 'Suspect created successfully', 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.deleteSuspect = async (req, res) => {
    try {
        const suspect = await Suspect.findById(req.params.id);
        if (!suspect) return sendError(res, 'Suspect not found', 404);

        const isAdmin = req.user.roles.includes('Admin');
        if (!isAdmin && suspect.user_id !== req.user.id) return sendError(res, 'Not authorized', 403);

        await Suspect.delete(req.params.id);
        sendSuccess(res, null, 'Suspect deleted successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};
