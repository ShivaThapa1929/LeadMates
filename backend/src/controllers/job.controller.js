const Job = require('../models/job.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get jobs (admin: all, user: own)
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        return sendSuccess(res, jobs, 'Jobs fetched successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Create a new job post
// @route   POST /api/jobs/post-job
// @access  Private
exports.createJob = async (req, res) => {
    try {
        const isAdmin = req.user.roles?.includes('Admin') || req.user.roles?.includes('Super Admin');
        const userPlan = req.user.plan || 'Identity Basic';
        const planStatus = req.user.plan_status || 'pending';

        // ─── Plan Gate (Backend-enforced, cannot be bypassed) ─────────────────
        if (!isAdmin) {
            // 1. Must not be on the free Identity Basic tier
            if (userPlan === 'Identity Basic') {
                return sendError(res, 'Please purchase a plan to post a job.', 403, { errorCode: 'PLAN_REQUIRED' });
            }

            // 2. Plan must be marked active and payment successful
            if (planStatus !== 'active' || req.user.payment_status !== 'success') {
                return sendError(res, 'Please purchase a plan to post a job.', 403, { errorCode: 'PLAN_INACTIVE' });
            }

            // 3. Check expiry date if set
            if (req.user.plan_expires_at) {
                const expiryDate = new Date(req.user.plan_expires_at);
                if (expiryDate < new Date()) {
                    return sendError(res, 'Your plan has expired. Please renew to post a job.', 403, {
                        errorCode: 'PLAN_EXPIRED',
                        expiredAt: expiryDate.toISOString()
                    });
                }
            }
        }
        // ──────────────────────────────────────────────────────────────────────

        const { title, description, location, salary, category } = req.body;

        // ─── Field Validation ─────────────────────────────────────────────────
        const missing = [];
        if (!title || !String(title).trim()) missing.push('title');
        if (!description || !String(description).trim()) missing.push('description');
        if (!location || !String(location).trim()) missing.push('location');
        if (!category || !String(category).trim()) missing.push('category');
        if (salary === undefined || salary === null || String(salary).trim() === '') missing.push('salary');

        if (missing.length > 0) {
            return sendError(res, `Required fields missing: ${missing.join(', ')}`, 400, { missingFields: missing });
        }

        const numericSalary = Number(salary);
        if (!Number.isFinite(numericSalary) || numericSalary < 0) {
            return sendError(res, 'Salary must be a valid non-negative number', 400);
        }
        // ──────────────────────────────────────────────────────────────────────

        const job = await Job.create({
            user_id: req.user.id,
            title: String(title).trim(),
            description: String(description).trim(),
            location: String(location).trim(),
            category: String(category).trim(),
            salary: numericSalary
        });

        return sendSuccess(res, job, 'Job posted successfully', 201);
    } catch (error) {
        return sendError(res, error.message);
    }
};


// @desc    Get public jobs with filtering
// @route   GET /api/jobs/public
// @access  Public
exports.getPublicJobs = async (req, res) => {
    try {
        const filters = req.query;
        const jobs = await Job.findPublicJobs(filters);
        return sendSuccess(res, jobs, 'Public jobs fetched successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (User/Admin)
exports.applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id;

        // Safely access body — multer populates req.body for multipart requests
        const body = req.body || {};
        const {
            full_name, email, phone, cover_letter, skills,
            aadhaar_number, experience_details, internship_details
        } = body;

        // ─── Required Fields Validation ───────────────────────────────────────
        const missing = [];
        if (!full_name || !String(full_name).trim()) missing.push('full_name');
        if (!email || !String(email).trim()) missing.push('email');
        if (!phone || !String(phone).trim()) missing.push('phone');
        if (!aadhaar_number || !String(aadhaar_number).trim()) missing.push('aadhaar_number');
        if (!req.file) missing.push('resume');

        if (missing.length > 0) {
            return sendError(res, `Required fields missing: ${missing.join(', ')}`, 400, { missingFields: missing });
        }

        // ─── Email format ─────────────────────────────────────────────────────
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendError(res, 'Please provide a valid email address', 400);
        }

        // ─── Aadhaar Validation: exactly 12 numeric digits ────────────────────
        const cleanAadhaar = String(aadhaar_number).replace(/\s/g, '');
        if (!/^\d{12}$/.test(cleanAadhaar)) {
            return sendError(res, 'Aadhaar number must be exactly 12 numeric digits', 400, { field: 'aadhaar_number' });
        }

        // ─── Parse JSON experience/internship from form-data string ───────────
        let parsedExperience = null;
        let parsedInternships = null;

        if (experience_details) {
            try {
                parsedExperience = typeof experience_details === 'string'
                    ? JSON.parse(experience_details)
                    : experience_details;
                if (!Array.isArray(parsedExperience)) parsedExperience = null;
            } catch { parsedExperience = null; }
        }

        if (internship_details) {
            try {
                parsedInternships = typeof internship_details === 'string'
                    ? JSON.parse(internship_details)
                    : internship_details;
                if (!Array.isArray(parsedInternships)) parsedInternships = null;
            } catch { parsedInternships = null; }
        }
        // ──────────────────────────────────────────────────────────────────────

        const applicationData = {
            full_name: String(full_name).trim(),
            email: String(email).trim().toLowerCase(),
            phone: String(phone).trim(),
            aadhaar_number: cleanAadhaar,
            cover_letter: cover_letter ? String(cover_letter).trim() : null,
            skills: skills ? String(skills).trim() : null,
            experience_details: parsedExperience || null,
            internship_details: parsedInternships || null,
            resume_url: `/uploads/resumes/${req.file.filename}`
        };

        const result = await Job.applyForJob(userId, jobId, applicationData);
        if (!result.success) {
            return sendError(res, result.message, 409);  // 409 Conflict for duplicates
        }

        return sendSuccess(res, null, 'Application submitted successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Get current user's job applications
// @route   GET /api/jobs/applications
// @access  Private
exports.getUserApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await Job.getUserApplications(userId);
        return sendSuccess(res, applications, 'User applications fetched successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Get all job applications (Admin only)
// @route   GET /api/jobs/admin/applications
// @access  Private (Admin)
exports.getAllApplications = async (req, res) => {
    try {
        const isAdmin = 
            req.user.role?.toLowerCase() === 'admin' || 
            req.user.role?.toLowerCase() === 'super admin' ||
            req.user.roles?.some(r => r.toLowerCase() === 'admin' || r.toLowerCase() === 'super admin');

        if (!isAdmin) {
            return sendError(res, 'Unprivileged access', 403);
        }
        const applications = await Job.getAllApplications();
        return sendSuccess(res, applications, 'All applications fetched successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Update application status (Admin only)
// @route   PATCH /api/jobs/admin/applications/:id/status
// @access  Private (Admin)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const isAdmin = 
            req.user.role?.toLowerCase() === 'admin' || 
            req.user.role?.toLowerCase() === 'super admin' ||
            req.user.roles?.some(r => r.toLowerCase() === 'admin' || r.toLowerCase() === 'super admin');

        if (!isAdmin) {
            return sendError(res, 'Unprivileged access', 403);
        }
        const { status } = req.body;
        const validStatuses = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return sendError(res, 'Invalid status', 400);
        }

        await Job.updateApplicationStatus(req.params.id, status);
        return sendSuccess(res, null, 'Application status updated successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};

// @desc    Delete application (Admin only)
// @route   DELETE /api/jobs/admin/applications/:id
// @access  Private (Admin)
exports.deleteApplication = async (req, res) => {
    try {
        const isAdmin = 
            req.user.role?.toLowerCase() === 'admin' || 
            req.user.role?.toLowerCase() === 'super admin' ||
            req.user.roles?.some(r => r.toLowerCase() === 'admin' || r.toLowerCase() === 'super admin');

        if (!isAdmin) {
            return sendError(res, 'Unprivileged access', 403);
        }
        await Job.deleteApplication(req.params.id);
        return sendSuccess(res, null, 'Application deleted successfully');
    } catch (error) {
        return sendError(res, error.message);
    }
};
