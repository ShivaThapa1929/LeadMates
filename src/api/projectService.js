import authService from './authService';

const getProjects = async () => {
    try {
        const response = await authService.api.get('/projects');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch projects' };
    }
};

const createProject = async (data) => {
    try {
        const response = await authService.api.post('/projects', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create project' };
    }
};

const deleteProject = async (id) => {
    try {
        const response = await authService.api.delete(`/projects/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete project' };
    }
};

const updateProject = async (id, data) => {
    try {
        const response = await authService.api.put(`/projects/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update project' };
    }
};

const projectService = {
    getProjects,
    createProject,
    deleteProject,
    updateProject
};

export default projectService;
