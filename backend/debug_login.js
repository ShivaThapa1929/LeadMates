const User = require('./src/models/user.model');
const { connectDB } = require('./src/config/db');

async function test() {
    try {
        await connectDB();
        console.log('Finding user...');
        const user = await User.findByEmail('shiva@example.com'); // Use a likely email or just check it doesn't crash
        console.log('User found:', user ? 'Yes' : 'No');
        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

test();
