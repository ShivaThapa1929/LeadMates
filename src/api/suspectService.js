import authService from './authService';

const getSuspects = async () => {
    try {
        const response = await authService.api.get('/suspects');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch suspects' };
    }
};

const createSuspect = async (data) => {
    try {
        const response = await authService.api.post('/suspects', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create suspect' };
    }
};

const deleteSuspect = async (id) => {
    try {
        const response = await authService.api.delete(`/suspects/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete suspect' };
    }
};

const suspectService = {
    getSuspects,
    createSuspect,
    deleteSuspect
};

export default suspectService;
