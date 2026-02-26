const { db } = require('../src/config/db');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

async function createDefaultAdmin() {
    const adminData = {
        name: 'Default Admin',
        email: 'admin@leadmates.com',
        password: 'AdminPassword123!',
        phone: '+910000000000',
        businessName: 'LeadMates Admin',
        website: 'https://admin.leadmates.com',
        experience: 'Administrator',
        role: 'admin'
    };

    try {
        console.log(`🔍 Checking if admin exists: ${adminData.email}`);
        const existingUser = await db('users').where({ email: adminData.email }).first();

        if (existingUser) {
            console.log('🔄 Admin already exists. Updating password and roles...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);

            await db('users').where({ id: existingUser.id }).update({
                name: adminData.name,
                password: hashedPassword,
                role: 'admin',
                is_verified: true,
                email_verified: true,
                phone_verified: true
            });

            // Ensure Admin role in user_roles
            const adminRole = await db('roles').where({ name: 'Admin' }).first();
            if (adminRole) {
                const userRole = await db('user_roles').where({ user_id: existingUser.id, role_id: adminRole.id }).first();
                if (!userRole) {
                    await db('user_roles').insert({ user_id: existingUser.id, role_id: adminRole.id });
                }
            }

            console.log('✅ Admin user updated successfully.');
        } else {
            console.log('➕ Creating new admin user...');
            // We use User.create to handle initial hashing and role assignment
            const newUser = await User.create(adminData);

            // Force verification status since User.create defaults to false
            await db('users').where({ id: newUser.id }).update({
                is_verified: true,
                email_verified: true,
                phone_verified: true
            });

            console.log('✅ Admin user created successfully.');
        }

        console.log('\n--- Admin Credentials ---');
        console.log(`Username (Email): ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log('--------------------------\n');
        console.log('Note: You can use these credentials to log in to the admin dashboard.');
        console.log('TIP: If email delivery fails, check the BACKEND console for the 2FA security code.');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        process.exit();
    }
}

createDefaultAdmin();
