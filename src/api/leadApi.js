import axios from 'axios';

const API_URL = '/api/leads';

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

const captureLead = async (leadData) => {
    const response = await api.post('/', leadData);
    return response.data;
};

const leadApi = {
    captureLead
};

export default leadApi;
