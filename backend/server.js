const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { connectDB } = require('./src/config/db');

// Verify database connection before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
});


