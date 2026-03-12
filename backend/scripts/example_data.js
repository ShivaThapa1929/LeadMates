const { db } = require('../src/config/db');
const Campaign = require('../src/models/campaign.model');
const Lead = require('../src/models/lead.model');

async function createExampleData() {
    try {
        console.log('🚀 Starting example data creation...');

        // 1. Find a user to associate data with
        const user = await db('users').where({ is_deleted: 0 }).first();
        if (!user) {
            console.error('❌ No users found in database. Please register a user first.');
            process.exit(1);
        }
        console.log(`✅ Using User: ${user.name} (ID: ${user.id})`);

        // 2. Create an Example Campaign
        const campaignData = {
            user_id: user.id,
            name: 'Summer Sales Blast 2026',
            status: 'ACTIVE',
            custom_values: JSON.stringify({
                budget: '5000 USD',
                target_audience: 'SaaS Owners',
                platform: 'Meta Ads'
            })
        };

        const newCampaign = await Campaign.create(campaignData);
        console.log('✅ Campaign Created:', newCampaign);

        // 3. Create an Example Lead
        const leadData = {
            user_id: user.id,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            channel: 'Meta Ads',
            status: 'NEW',
            campaign_name: newCampaign.name, // Link to the campaign we just created
            campaign_type: 'Search',
            source: 'Facebook',
            notes: 'Interested in the Premium Plan.',
            custom_values: JSON.stringify({
                company_size: '50-100',
                industry: 'Marketing'
            })
        };

        const newLead = await Lead.create(leadData);
        console.log('✅ Lead Created:', newLead);

        // 4. Create 3 More Diverse Leads
        const extraLeads = [
            {
                user_id: user.id,
                name: 'Sarah Miller',
                email: 'sarah.m@techcorp.io',
                phone: '+1987654321',
                channel: 'LinkedIn Outreach',
                status: 'CONTACTED',
                campaign_name: 'B2B Expansion Q1',
                campaign_type: 'Outbound',
                source: 'LinkedIn',
                notes: 'Requested a demo for her team.',
                custom_values: JSON.stringify({ priority: 'High', team_size: '200+' })
            },
            {
                user_id: user.id,
                name: 'Michael Chen',
                email: 'm.chen@venture.net',
                phone: '+1122334455',
                channel: 'Google Search',
                status: 'CONVERTED',
                campaign_name: 'Search Ads - High Intent',
                campaign_type: 'PPC',
                source: 'Google',
                notes: 'Already signed up for the starter plan.',
                custom_values: JSON.stringify({ lead_score: 95, refers: 'N/A' })
            },
            {
                user_id: user.id,
                name: 'Elena Rodriguez',
                email: 'elena.r@lifestyle.com',
                phone: '+1555666777',
                channel: 'Referral',
                status: 'NEW',
                campaign_name: 'Partner Program',
                campaign_type: 'Partner',
                source: 'Existing Client',
                notes: 'Referred by Dave from Global Logistics.',
                custom_values: JSON.stringify({ industry: 'Retail', urgent: true })
            }
        ];

        for (const lead of extraLeads) {
            const created = await Lead.create(lead);
            console.log(`✅ Lead Created: ${created.name} (${created.status})`);
        }

        console.log('\n✨ All example data created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating example data:', error);
        process.exit(1);
    }
}

createExampleData();
