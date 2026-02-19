import authService from './authService';

const getCampaigns = async () => {
    try {
        const response = await authService.api.get('/campaigns');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch campaigns' };
    }
};

const createCampaign = async (data) => {
    try {
        const response = await authService.api.post('/campaigns', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create campaign' };
    }
};

const deleteCampaign = async (id) => {
    try {
        const response = await authService.api.delete(`/campaigns/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete campaign' };
    }
};

const updateCampaign = async (id, data) => {
    try {
        const response = await authService.api.put(`/campaigns/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update campaign' };
    }
};

const campaignService = {
    getCampaigns,
    createCampaign,
    deleteCampaign,
    updateCampaign
};

export default campaignService;
