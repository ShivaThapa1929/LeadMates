import axios from 'axios';

const API_URL = '/api/custom-fields';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const getCustomFields = async () => {
    const response = await api.get('/');
    return response.data;
};

const createCustomField = async (fieldData) => {
    const response = await api.post('/', fieldData);
    return response.data;
};

const deleteCustomField = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};

const customFieldApi = {
    getCustomFields,
    createCustomField,
    deleteCustomField
};

export default customFieldApi;
