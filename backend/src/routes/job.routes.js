const express = require('express');
const router = express.Router();
const { createJob, getJobs, getPublicJobs, applyJob, getUserApplications, getAllApplications, updateApplicationStatus, deleteApplication } = require('../controllers/job.controller');
const { protect, isPlanActive } = require('../middlewares/auth.middleware');
const resumeUpload = require('../middlewares/resumeUpload.middleware');

// Public route to view jobs
router.get('/public', getPublicJobs);

// All other job routes are protected
router.use(protect);

// GET /api/jobs (User/Admin listing)
router.get('/', getJobs);

// GET /api/jobs/applications (User-specific)
router.get('/applications', protect, getUserApplications);

// ADMIN ROUTES
// GET /api/jobs/admin/applications
router.get('/admin/applications', protect, getAllApplications);

// PATCH /api/jobs/admin/applications/:id/status
router.patch('/admin/applications/:id/status', protect, updateApplicationStatus);

// DELETE /api/jobs/admin/applications/:id
router.delete('/admin/applications/:id', protect, deleteApplication);

// POST /api/jobs/post-job
router.post('/post-job', isPlanActive, createJob);

// POST /api/jobs/:id/apply — protect MUST run before resumeUpload so req.user exists for filename generation
router.post('/:id/apply', protect, resumeUpload.single('resume'), applyJob);

module.exports = router;

