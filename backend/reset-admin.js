const { db } = require('./src/config/db');
const User = require('./src/models/user.model');

async function resetAdminPassword() {
    const adminEmail = 'founder@leadmates.com';
    const newPassword = 'Password123!';

    try {
        console.log(`🔍 Searching for admin user: ${adminEmail}`);
        const user = await db('users').where({ email: adminEmail }).first();

        if (!user) {
            console.log('❌ Admin user not found. Creating one...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: newPassword,
                phone: '0000000000',
                businessName: 'LeadMates HQ',
                website: 'https://leadmates.com',
                experience: 'SaaS / Software'
            });
            // Elevate to Admin role
            const newUser = await db('users').where({ email: adminEmail }).first();
            const adminRole = await db('roles').where({ name: 'Admin' }).first();
            if (adminRole) {
                await db('user_roles').insert({ user_id: newUser.id, role_id: adminRole.id });
                await db('users').where({ id: newUser.id }).update({ role: 'admin' });
            }
            console.log('✅ Admin user created with password: Password123!');
        } else {
            console.log('🔄 User found. Resetting password...');
            await User.update(user.id, { password: newPassword });
            console.log('✅ Password reset successful!');
        }
    } catch (error) {
        console.error('❌ Error during password reset:', error);
    } finally {
        process.exit();
    }
}

resetAdminPassword();
