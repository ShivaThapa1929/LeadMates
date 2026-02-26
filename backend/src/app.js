const express = require('express');
const cors = require('cors');
const path = require('path');
const { NODE_ENV } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const campaignRoutes = require('./routes/campaign.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const suspectRoutes = require('./routes/suspect.routes');
const roleRoutes = require('./routes/role.routes');
const trashRoutes = require('./routes/trash.routes');
const customFieldRoutes = require('./routes/customField.routes');
const cookieParser = require('cookie-parser');
const { sendError } = require('./utils/responseHandler');

const app = express();

/**
 * Global Middlewares
 */
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies
app.use(cors({
    origin: [
        'http://localhost:5173', 'http://127.0.0.1:5173',
        'http://localhost:5174', 'http://127.0.0.1:5174',
        'http://localhost:5175', 'http://127.0.0.1:5175'
    ],
    credentials: true
})); // Enable CORS
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Request Logger (Development only)
 */
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

/**
 * API Root & System Endpoints
 */
app.get('/api', (req, res) => {
    res.json({ message: 'LeadMates API Running', version: '1.0.0' });
});

// Suppress favicon 404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/suspects', suspectRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/trash', trashRoutes);
app.use('/api/custom-fields', customFieldRoutes);

/**
 * 404 Handler - Catch-all for undefined routes
 */
app.use((req, res, next) => {
    sendError(res, `Route ${req.originalUrl} not found`, 404);
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
    console.error('SERVER_ERROR:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = NODE_ENV === 'development' ? err.message : 'Internal Server Error';

    sendError(res, message, statusCode);
});

module.exports = app;
