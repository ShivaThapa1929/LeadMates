const Lead = require('../models/lead.model');
const { db } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get all leads for logged in user
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');
        let leads;

        if (isAdmin) {
            leads = await Lead.findAll();
        } else {
            leads = await Lead.findUserLeads(req.user.id);
        }

        const formattedLeads = leads.map(lead => ({
            ...lead,
            custom_values: typeof lead.custom_values === 'string' ? JSON.parse(lead.custom_values) : lead.custom_values
        }));

        sendSuccess(res, formattedLeads, 'Leads fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

// @desc    Get Analysis Data
// @route   GET /api/leads/analysis
// @access  Private
exports.getAnalysis = async (req, res) => {
    try {
        const { start_date, end_date, campaign_type, campaign_name, source, custom_source } = req.query;

        // Helper for building filtered query
        const buildQuery = () => {
            let q = db('leads').where('is_deleted', false);

            if (start_date) q.where('created_at', '>=', start_date);
            if (end_date) q.where('created_at', '<=', `${end_date} 23:59:59`);

            if (campaign_type && campaign_type !== 'All' && campaign_type !== 'All Types') {
                q.where('campaign_type', campaign_type);
            }

            if (campaign_name && campaign_name !== 'All') {
                q.where('campaign_name', 'like', `%${campaign_name}%`);
            }

            // Source search
            if (custom_source) {
                q.where('source', 'like', `%${custom_source}%`);
            } else if (source && source !== 'All') {
                q.where('source', 'like', `%${source}%`);
            }

            return q;
        };

        // 1. Total Leads
        const totalRes = await buildQuery().count('* as count').first();
        const total_leads = parseInt(totalRes.count || 0);

        // 2. Converted Leads
        const convertedRes = await buildQuery()
            .whereIn('status', ['CONVERTED', 'WON', 'Converted', 'Won'])
            .count('* as count').first();
        const converted_leads = parseInt(convertedRes.count || 0);

        // 3. Conversion Rate
        const conversion_rate = total_leads > 0
            ? parseFloat(((converted_leads / total_leads) * 100).toFixed(1))
            : 0;

        // 4. Breakdown by Campaign (Top 10)
        let campaign_breakdown = await buildQuery()
            .select('campaign_name as name', db.raw('count(*) as value'))
            .whereNotNull('campaign_name')
            .groupBy('campaign_name')
            .orderBy('value', 'desc')
            .limit(10);

        // 5. Breakdown by Source (Top 10)
        let source_breakdown = await buildQuery()
            .select('source as name', db.raw('count(*) as value'))
            .whereNotNull('source')
            .groupBy('source')
            .orderBy('value', 'desc')
            .limit(10);

        // 6. Best Performing Campaign (by conversion rate, min 1 lead)
        const campaignStats = await buildQuery()
            .select('campaign_name')
            .count('* as total')
            .select(db.raw("SUM(CASE WHEN status IN ('CONVERTED', 'WON', 'Converted', 'Won') THEN 1 ELSE 0 END) as converted"))
            .whereNotNull('campaign_name')
            .groupBy('campaign_name')
            .orderByRaw('(SUM(CASE WHEN status IN (\'CONVERTED\', \'WON\', \'Converted\', \'Won\') THEN 1 ELSE 0 END) * 1.0 / count(*)) desc')
            .first();

        let best_campaign_data = {
            name: "N/A",
            conversion_rate: 0,
            total_leads: 0
        };

        if (campaignStats) {
            const total = parseInt(campaignStats.total || 0);
            const converted = parseInt(campaignStats.converted || 0);
            best_campaign_data = {
                name: campaignStats.campaign_name,
                total_leads: total,
                conversion_rate: total > 0 ? parseFloat(((converted / total) * 100).toFixed(1)) : 0
            };
        }

        // 7. Best Performing Source
        const bestSourceRes = await buildQuery()
            .select('source')
            .whereIn('status', ['CONVERTED', 'WON', 'Converted', 'Won'])
            .whereNotNull('source')
            .groupBy('source')
            .orderByRaw('count(*) desc')
            .first();

        // 8. Trend Data
        const trendRaw = await buildQuery()
            .select(db.raw('DATE(created_at) as date'), db.raw('count(*) as leads'))
            .groupByRaw('DATE(created_at)')
            .orderBy('date', 'asc');

        const trend_data = trendRaw.map(r => ({
            date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date,
            leads: parseInt(r.leads || 0)
        }));

        // 9. Extra: Get unique campaign names and sources for filters
        const uniqueCampaigns = await db('leads').distinct('campaign_name').whereNotNull('campaign_name').pluck('campaign_name');
        const uniqueSources = await db('leads').distinct('source').whereNotNull('source').pluck('source');

        sendSuccess(res, {
            total_leads,
            converted_leads,
            conversion_rate,
            best_campaign: best_campaign_data.name,
            best_campaign_details: best_campaign_data,
            best_source: bestSourceRes ? bestSourceRes.source : "N/A",
            campaign_breakdown: campaign_breakdown.map(i => ({ name: i.name || 'Unknown', value: parseInt(i.value) })),
            source_breakdown: source_breakdown.map(i => ({ name: i.name || 'Unknown', value: parseInt(i.value) })),
            trend_data,
            filters: {
                campaigns: uniqueCampaigns.filter(Boolean),
                sources: uniqueSources.filter(Boolean)
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        sendError(res, "Failed to generate analysis data.");
    }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        const { name, email, contact, phone, channel, status, assigned_to, notes, custom_values, campaign_type, campaign_name, source } = req.body;

        // Validation - Require Name + (Email OR Contact/Phone)
        const phoneValue = phone || contact;
        if (!name || (!email && !phoneValue)) {
            return sendError(res, 'Name and at least one contact method (Email or Phone) are required', 400);
        }

        // Email format validation (if provided)
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return sendError(res, 'Invalid email format', 400);
            }
        }

        const leadData = {
            user_id: req.user.id,
            name,
            email,
            contact: phoneValue || '',
            phone: phoneValue || '',
            channel: channel || 'Manual Entry',
            status: status || 'NEW',
            assigned_to,
            notes,
            campaign_type,
            campaign_name,
            source: source || channel || 'Direct'
        };

        // Custom Fields Validation
        const customFields = await require('../models/customField.model').findAll();
        const validatedCustomValues = {};

        if (custom_values && typeof custom_values === 'object') {
            for (const field of customFields) {
                const value = custom_values[field.field_name];
                if (value) {
                    validatedCustomValues[field.field_name] = value;
                }
            }
        }

        leadData.custom_values = JSON.stringify(validatedCustomValues);

        const lead = await Lead.create(leadData);

        sendSuccess(res, lead, 'Lead captured successfully', 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return sendError(res, 'Lead not found', 404);
        }

        const isAdmin = req.user.roles.includes('Admin');
        const isCreator = lead.user_id === req.user.id;
        const isAssignee = lead.assigned_to === req.user.id;

        // Check authorization
        if (!isAdmin && !isCreator && !isAssignee) {
            return sendError(res, 'Not authorized to update this lead', 403);
        }

        const updatedLead = await Lead.update(req.params.id, req.body);
        sendSuccess(res, updatedLead, 'Lead updated successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return sendError(res, 'Lead not found', 404);
        }

        const isAdmin = req.user.roles.includes('Admin');
        const isCreator = lead.user_id === req.user.id;

        // Only creator or Admin can delete
        if (!isAdmin && !isCreator) {
            return sendError(res, 'Not authorized to delete this lead. Only creators or admins can delete.', 403);
        }

        await Lead.delete(req.params.id, req.user.id);
        sendSuccess(res, null, 'Lead moved to trash');
    } catch (error) {
        sendError(res, error.message);
    }
};

// @desc    Get a single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return sendError(res, 'Lead not found', 404);
        }

        const isAdmin = req.user.roles.includes('Admin');
        const isCreator = lead.user_id === req.user.id;
        const isAssignee = lead.assigned_to === req.user.id;

        if (!isAdmin && !isCreator && !isAssignee) {
            return sendError(res, 'Not authorized to view this lead', 403);
        }

        lead.custom_values = typeof lead.custom_values === 'string' ? JSON.parse(lead.custom_values) : lead.custom_values;

        sendSuccess(res, lead, 'Lead fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};
