const { db } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Trash Management Controller
 */
const TrashController = {
    // @desc    Get all trashed items for a module
    // @route   GET /api/trash?module=leads
    // @access  Private (Admin/Sub-admin)
    getTrash: async (req, res) => {
        try {
            const { module } = req.query;
            if (!module) {
                return sendError(res, 'Module parameter is required', 400);
            }

            const validModules = ['leads', 'users', 'campaigns', 'projects'];
            if (!validModules.includes(module)) {
                return sendError(res, 'Invalid module. Valid modules are: leads, users, campaigns, projects', 400);
            }

            // Get deleted items joined with the user who deleted it
            const trashedItems = await db(module)
                .leftJoin('users as deleter', `${module}.deleted_by`, 'deleter.id')
                .where(`${module}.is_deleted`, true)
                .select(
                    `${module}.*`,
                    'deleter.name as deleted_by_name'
                )
                .orderBy(`${module}.deleted_at`, 'desc');

            sendSuccess(res, trashedItems, `Trashed ${module} fetched successfully`);
        } catch (error) {
            sendError(res, error.message);
        }
    },

    // @desc    Restore a trashed item
    // @route   PATCH /api/trash/restore/:module/:id
    // @access  Private (Admin/Sub-admin)
    restoreItem: async (req, res) => {
        try {
            const { module, id } = req.params;
            const validModules = ['leads', 'users', 'campaigns', 'projects'];
            if (!validModules.includes(module)) {
                return sendError(res, 'Invalid module', 400);
            }

            const item = await db(module).where({ id, is_deleted: true }).first();
            if (!item) {
                return sendError(res, 'Item not found in trash', 404);
            }

            await db(module).where({ id }).update({
                is_deleted: false,
                deleted_at: null,
                deleted_by: null
            });

            sendSuccess(res, null, 'Item restored successfully');
        } catch (error) {
            sendError(res, error.message);
        }
    },

    // @desc    Permanently delete a trashed item
    // @route   DELETE /api/trash/permanent/:module/:id
    // @access  Private (Admin only)
    permanentDelete: async (req, res) => {
        try {
            const { module, id } = req.params;
            const validModules = ['leads', 'users', 'campaigns', 'projects'];
            if (!validModules.includes(module)) {
                return sendError(res, 'Invalid module', 400);
            }

            if (!req.user.roles.includes('Admin') && !req.user.roles.includes('Super Admin')) {
                return sendError(res, 'Only Admins can perform permanent deletion', 403);
            }

            const item = await db(module).where({ id, is_deleted: true }).first();
            if (!item) {
                return sendError(res, 'Item not found in trash', 404);
            }

            await db(module).where({ id }).del();

            sendSuccess(res, null, 'Item permanently deleted');
        } catch (error) {
            sendError(res, error.message);
        }
    }
};

module.exports = TrashController;
