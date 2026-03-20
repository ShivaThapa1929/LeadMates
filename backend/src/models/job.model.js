const { db } = require('../config/db');

const Job = {
    tableName: 'jobs',

    findAll: async () => {
        return await db(Job.tableName)
            .leftJoin('users', 'jobs.user_id', 'users.id')
            .where({ 'jobs.is_deleted': false, 'jobs.status': 'ACTIVE' })
            .select('jobs.*', 'users.name as company_name', 'users.business_name', 'users.role as user_role')
            .orderBy('jobs.created_at', 'desc');
    },

    findUserJobs: async (userId) => {
        return await db(Job.tableName)
            .where({ user_id: userId, is_deleted: false })
            .orderBy('created_at', 'desc');
    },

    findById: async (id) => {
        return await db(Job.tableName).where({ id, is_deleted: false }).first();
    },

    create: async (jobData) => {
        const [id] = await db(Job.tableName).insert(jobData);
        return await Job.findById(id);
    },

    findPublicJobs: async (filters = {}) => {
        let query = db(Job.tableName)
            .join('users', 'jobs.user_id', 'users.id')
            .where({ 'jobs.is_deleted': false, 'jobs.status': 'ACTIVE' })
            .select('jobs.*', 'users.name as company_name', 'users.business_name');

        if (filters.category) query.where({ category: filters.category });
        if (filters.location) query.where('location', 'like', `%${filters.location}%`);
        if (filters.job_type) query.where({ job_type: filters.job_type });
        if (filters.min_salary) query.where('salary', '>=', filters.min_salary);
        if (filters.max_salary) query.where('salary', '<=', filters.max_salary);

        return await query.orderBy('jobs.created_at', 'desc');
    },

    applyForJob: async (userId, jobId, applicationData) => {
        // Check if already applied
        const existing = await db('job_applications').where({ user_id: userId, job_id: jobId }).first();
        if (existing) return { success: false, message: 'Already applied' };

        await db('job_applications').insert({
            user_id: userId,
            job_id: jobId,
            status: 'PENDING',
            ...applicationData
        });
        return { success: true };
    },

    getUserApplications: async (userId) => {
        return await db('job_applications')
            .join('jobs', 'job_applications.job_id', 'jobs.id')
            .leftJoin('users as employers', 'jobs.user_id', 'employers.id')
            .where({ 'job_applications.user_id': userId })
            .select(
                'job_applications.*', 
                'jobs.title as job_title', 
                'jobs.location as job_location',
                db.raw('COALESCE(employers.business_name, employers.name) as job_company')
            )
            .orderBy('job_applications.created_at', 'desc');
    },

    getAllApplications: async () => {
        return await db('job_applications')
            .join('jobs', 'job_applications.job_id', 'jobs.id')
            .leftJoin('users as applicants', 'job_applications.user_id', 'applicants.id')
            .leftJoin('users as employers', 'jobs.user_id', 'employers.id')
            .select(
                'job_applications.*', 
                'jobs.title as job_title', 
                db.raw('COALESCE(employers.business_name, employers.name) as job_company'),
                'applicants.name as applicant_name',
                'applicants.email as applicant_email'
            )
            .orderBy('job_applications.created_at', 'desc');
    },

    updateApplicationStatus: async (applicationId, status) => {
        return await db('job_applications')
            .where({ id: applicationId })
            .update({ status, updated_at: db.fn.now() });
    },

    deleteApplication: async (id) => {
        return await db('job_applications').where({ id }).del();
    }
};

module.exports = Job;

