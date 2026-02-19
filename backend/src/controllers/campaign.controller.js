const Campaign = require('../models/campaign.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getCampaigns = async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');
        let campaigns;

        if (isAdmin) {
            campaigns = await Campaign.findAll();
        } else {
            campaigns = await Campaign.findAllByUserId(req.user.id);
        }

        const formattedCampaigns = campaigns.map(c => ({
            ...c,
            custom_values: typeof c.custom_values === 'string' ? JSON.parse(c.custom_values) : (c.custom_values || {})
        }));

        sendSuccess(res, formattedCampaigns, 'Campaigns fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.createCampaign = async (req, res) => {
    try {
        const { name, status, custom_values } = req.body;
        const campaign = await Campaign.create({
            user_id: req.user.id,
            name,
            status: status || 'ACTIVE',
            custom_values: custom_values ? JSON.stringify(custom_values) : JSON.stringify({})
        });
        sendSuccess(res, campaign, 'Campaign created successfully', 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return sendError(res, 'Campaign not found', 404);

        const isAdmin = req.user.roles.includes('Admin');
        if (!isAdmin && campaign.user_id !== req.user.id) return sendError(res, 'Not authorized', 403);

        const dataToUpdate = { ...req.body };
        if (dataToUpdate.custom_values && typeof dataToUpdate.custom_values === 'object') {
            dataToUpdate.custom_values = JSON.stringify(dataToUpdate.custom_values);
        }

        const updated = await Campaign.update(req.params.id, dataToUpdate);

        if (updated) {
            updated.custom_values = typeof updated.custom_values === 'string' ? JSON.parse(updated.custom_values) : (updated.custom_values || {});
        }

        sendSuccess(res, updated, 'Campaign updated successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return sendError(res, 'Campaign not found', 404);

        const isAdmin = req.user.roles.includes('Admin');
        if (!isAdmin && campaign.user_id !== req.user.id) return sendError(res, 'Not authorized', 403);

        await Campaign.delete(req.params.id, req.user.id);
        sendSuccess(res, null, 'Campaign moved to trash');
    } catch (error) {
        sendError(res, error.message);
    }
};
