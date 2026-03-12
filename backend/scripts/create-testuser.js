const { db } = require('../src/config/db');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

async function createDefaultTestUser() {
    const testUserData = {
        name: 'Test User',
        email: 'testuser@leadmates.com',
        password: 'TestUser@123',
        phone: '+911111111111',
        businessName: 'LeadMates Test',
        website: 'https://test.leadmates.com',
        experience: 'Tester',
        role: 'user'
    };

    try {
        console.log(`🔍 Checking if test user exists: ${testUserData.email}`);
        const existingUser = await db('users').where({ email: testUserData.email }).first();

        if (existingUser) {
            console.log('🔄 Test user already exists. Updating password and verification status...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(testUserData.password, salt);

            await db('users').where({ id: existingUser.id }).update({
                name: testUserData.name,
                role: 'user',
                is_verified: true,
                email_verified: true,
                phone_verified: true
            });

            await db('user_credentials').where({ user_id: existingUser.id }).update({
                password_hash: hashedPassword,
                updated_at: db.fn.now()
            });

            // Ensure User role in user_roles
            const userRole = await db('roles').where({ name: 'User' }).first();
            if (userRole) {
                const existingAssignment = await db('user_roles')
                    .where({ user_id: existingUser.id, role_id: userRole.id })
                    .first();
                if (!existingAssignment) {
                    await db('user_roles').insert({ user_id: existingUser.id, role_id: userRole.id });
                }
            }

            console.log('✅ Test user updated successfully.');
        } else {
            console.log('➕ Creating new test user...');
            // Use User.create to handle password hashing and role assignment
            const newUser = await User.create(testUserData);

            // Force verification status
            await db('users').where({ id: newUser.id }).update({
                is_verified: true,
                email_verified: true,
                phone_verified: true
            });

            console.log('✅ Test user created successfully.');
        }

        console.log('\n--- Test User Credentials ---');
        console.log(`Username (Email): ${testUserData.email}`);
        console.log(`Password:         ${testUserData.password}`);
        console.log(`Phone:            ${testUserData.phone}`);
        console.log(`Role:             ${testUserData.role}`);
        console.log('-----------------------------\n');
        console.log('TIP: Use these credentials to log in as a regular (non-admin) test user.');

    } catch (error) {
        console.error('❌ Error creating test user:', error);
    } finally {
        process.exit();
    }
}

createDefaultTestUser();
