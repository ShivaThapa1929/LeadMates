import authService from './authService';

const getLeads = async () => {
    const response = await authService.api.get('/leads');
    return response.data;
};

const createLead = async (leadData) => {
    const response = await authService.api.post('/leads', leadData);
    return response.data;
};

const updateLead = async (id, leadData) => {
    const response = await authService.api.put(`/leads/${id}`, leadData);
    return response.data;
};

const deleteLead = async (id) => {
    const response = await authService.api.delete(`/leads/${id}`);
    return response.data;
};

const getLead = async (id) => {
    const response = await authService.api.get(`/leads/${id}`);
    return response.data;
};

const leadService = {
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead
};

export default leadService;
