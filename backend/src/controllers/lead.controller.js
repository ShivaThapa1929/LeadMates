const Lead = require('../models/lead.model');
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

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        const { name, email, contact, channel, status, assigned_to, notes, custom_values } = req.body;

        // Validation
        if (!name || !email || !contact) {
            return sendError(res, 'Name, Email, and Contact are mandatory fields', 400);
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 'Invalid email format', 400);
        }

        // Contact numeric validation
        const contactRegex = /^[0-9+\s-]{8,20}$/;
        if (!contactRegex.test(contact)) {
            return sendError(res, 'Invalid contact number. Use only numbers, +, -, or space (min 8 digits).', 400);
        }

        const leadData = {
            user_id: req.user.id,
            name,
            email,
            contact,
            phone: contact, // Keep phone for backward compatibility if any
            channel: channel || 'Manual Entry',
            status: status || 'NEW',
            assigned_to,
            notes
        };

        // Custom Fields Validation (Optional but recommended)
        const customFields = await require('../models/customField.model').findAll();
        const validatedCustomValues = {};

        if (custom_values && typeof custom_values === 'object') {
            for (const field of customFields) {
                const value = custom_values[field.field_name];
                if (value) {
                    if (field.field_type === 'select') {
                        const options = typeof field.options === 'string' ? JSON.parse(field.options) : field.options;
                        if (options && !options.includes(value)) {
                            return sendError(res, `Invalid option for custom field: ${field.field_name}`, 400);
                        }
                    }
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
