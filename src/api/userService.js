import authService from './authService';

const getUsers = async () => {
    try {
        const response = await authService.api.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch users' };
    }
};

const createUser = async (userData) => {
    try {
        const response = await authService.api.post('/admin/users', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create user' };
    }
};

const updateUser = async (id, userData) => {
    try {
        const response = await authService.api.put(`/admin/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update user' };
    }
};

const deleteUser = async (id) => {
    try {
        const response = await authService.api.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete user' };
    }
};

const updateUserAvatar = async (id, formData) => {
    try {
        const response = await authService.api.post(`/admin/users/${id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update user avatar' };
    }
};

const userService = {
    getUsers,
    createUser,
    updateUser,
    updateUserAvatar,
    deleteUser
};

export default userService;
