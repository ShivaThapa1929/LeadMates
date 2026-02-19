const CustomField = require('../models/customField.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Custom Fields Controller
 */
const CustomFieldController = {
    // @desc    Get all custom fields
    // @route   GET /api/custom-fields
    // @access  Private
    getCustomFields: async (req, res) => {
        try {
            const fields = await CustomField.findAll();

            // Parse options JSON if it's a string
            const formattedFields = fields.map(field => ({
                ...field,
                options: typeof field.options === 'string' ? JSON.parse(field.options) : field.options
            }));

            sendSuccess(res, formattedFields, 'Custom fields fetched successfully');
        } catch (error) {
            sendError(res, error.message);
        }
    },

    // @desc    Create a custom field
    // @route   POST /api/custom-fields
    // @access  Private (Admin Only)
    createCustomField: async (req, res) => {
        try {
            const { field_name, field_type, options } = req.body;

            if (!field_name) {
                return sendError(res, 'Field name is required', 400);
            }

            const field = await CustomField.create({
                field_name,
                field_type,
                options
            });

            sendSuccess(res, field, 'Custom field created successfully', 201);
        } catch (error) {
            sendError(res, error.message);
        }
    },

    // @desc    Delete a custom field
    // @route   DELETE /api/custom-fields/:id
    // @access  Private (Admin Only)
    deleteCustomField: async (req, res) => {
        try {
            const { id } = req.params;
            await CustomField.delete(id);
            sendSuccess(res, null, 'Custom field deleted successfully');
        } catch (error) {
            sendError(res, error.message);
        }
    }
};

module.exports = CustomFieldController;
