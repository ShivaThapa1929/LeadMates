import authService from './authService';

const getTrash = async (module) => {
    const response = await authService.api.get(`/trash?module=${module}`);
    return response.data;
};

const restoreItem = async (module, id) => {
    const response = await authService.api.patch(`/trash/restore/${module}/${id}`);
    return response.data;
};

const permanentDelete = async (module, id) => {
    const response = await authService.api.delete(`/trash/permanent/${module}/${id}`);
    return response.data;
};

const trashService = {
    getTrash,
    restoreItem,
    permanentDelete
};

export default trashService;
