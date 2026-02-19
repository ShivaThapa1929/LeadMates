import authService from './authService';

const getRoles = async () => {
    const response = await authService.api.get('/roles');
    return response.data;
};

const createRole = async (roleData) => {
    const response = await authService.api.post('/roles', roleData);
    return response.data;
};

const updateRole = async (id, roleData) => {
    const response = await authService.api.put(`/roles/${id}`, roleData);
    return response.data;
};

const deleteRole = async (id) => {
    // Implement if backend supports delete
    // const response = await authService.api.delete(`/roles/${id}`);
    // return response.data;
    throw new Error("Delete role not implemented");
};

const roleService = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};

export default roleService;
