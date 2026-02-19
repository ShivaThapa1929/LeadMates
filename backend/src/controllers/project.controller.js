const Project = require('../models/project.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.getProjects = async (req, res) => {
    try {
        const isAdmin = req.user.roles.includes('Admin');
        let projects;

        if (isAdmin) {
            projects = await Project.findAll();
        } else {
            projects = await Project.findAllByUserId(req.user.id);
        }

        sendSuccess(res, projects, 'Projects fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.createProject = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const project = await Project.create({
            user_id: req.user.id,
            name,
            description,
            status: status || 'PLANNING'
        });
        sendSuccess(res, project, 'Project created successfully', 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return sendError(res, 'Project not found', 404);

        const isAdmin = req.user.roles.includes('Admin');
        if (!isAdmin && project.user_id !== req.user.id) return sendError(res, 'Not authorized', 403);

        const updatedProject = await Project.update(req.params.id, req.body);
        sendSuccess(res, updatedProject, 'Project updated successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return sendError(res, 'Project not found', 404);

        const isAdmin = req.user.roles.includes('Admin');
        if (!isAdmin && project.user_id !== req.user.id) return sendError(res, 'Not authorized', 403);

        await Project.delete(req.params.id, req.user.id);
        sendSuccess(res, null, 'Project moved to trash');
    } catch (error) {
        sendError(res, error.message);
    }
};

exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return sendError(res, 'Project not found', 404);

        const isAdmin = req.user.roles.includes('Admin');
        if (!isAdmin && project.user_id !== req.user.id) return sendError(res, 'Not authorized', 403);

        sendSuccess(res, project, 'Project fetched successfully');
    } catch (error) {
        sendError(res, error.message);
    }
};
