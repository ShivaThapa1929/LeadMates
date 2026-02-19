const nodemailer = require('nodemailer');

async function test(user, pass) {
    console.log(`\n--- Testing ${user} ---`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });
    try {
        await transporter.verify();
        console.log(`✅ ${user} worked!`);
        return true;
    } catch (e) {
        console.log(`❌ ${user} failed: ${e.message}`);
        return false;
    }
}

async function run() {
    const pass = 'klqezvvqzzctzfbx';
    await test('techmatess.tech@gmail.com', pass);
    await test('faisaldk630@gmail.com', pass);
}

run();
