/**
 * Standard utility for consistent API responses
 */

/**
 * @desc    Send success response
 * @param   {Object} res - Express response object
 * @param   {Object} data - Data to send
 * @param   {String} message - Custom success message
 * @param   {Number} statusCode - HTTP status code
 */
exports.sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: data || null
    });
};

/**
 * @desc    Send error response
 * @param   {Object} res - Express response object
 * @param   {String} message - Error message
 * @param   {Number} statusCode - HTTP status code
 * @param   {Array|Object} errors - Detailed errors (e.g. validation)
 */
exports.sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors: errors || null
    });
};
