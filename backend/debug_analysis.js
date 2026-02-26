const { db } = require('./src/config/db');
require('dotenv').config();
const { getAnalysis } = require('./src/controllers/lead.controller');

async function debugAnalysis() {
    const req = {
        query: {},
        user: { id: 1, roles: ['Admin'] }
    };
    const res = {
        status: (code) => {
            console.log('Status:', code);
            return res;
        },
        json: (data) => {
            console.log('JSON Output:', JSON.stringify(data, null, 2));
        }
    };

    try {
        console.log('Starting Analysis Debug...');
        await getAnalysis(req, res);
    } catch (error) {
        console.error('Debug Error Catch:', error);
    } finally {
        process.exit(0);
    }
}

debugAnalysis();
