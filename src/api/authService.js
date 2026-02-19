import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
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

// Queue for concurrent requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor for handling auth errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle Unverified Users
        if (error.response?.status === 403 && error.response?.data?.errors?.errorCode === 'NOT_VERIFIED') {
            const userId = error.response.data.errors.userId;
            if (userId && !window.location.pathname.includes('/verify-otp')) {
                window.location.href = `/verify-otp?userId=${userId}`;
            }
            return Promise.reject(error);
        }

        // If error is 401 and it's not a retry and not a login request
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    console.log('🔄 AuthService: Attempting to refresh token...');
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

                    if (response.data.success) {
                        const { accessToken } = response.data.data;
                        localStorage.setItem('accessToken', accessToken);

                        processQueue(null, accessToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    console.error('❌ AuthService: Refresh token expired or invalid.');
                    logout();
                    if (window.location.pathname.startsWith('/dashboard')) {
                        window.location.href = '/login';
                    }
                } finally {
                    isRefreshing = false;
                }
            } else {
                logout();
                if (window.location.pathname.startsWith('/dashboard')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

const login = async (email, password) => {
    try {
        console.log('📬 AuthService: Attempting login...');
        const response = await api.post('/auth/login', { email, password });

        // 2FA Handling
        if (response.data.data.require2fa) {
            return {
                require2fa: true,
                tempToken: response.data.data.tempToken,
                userId: response.data.data.userId,
                channel: response.data.data.channel,
                message: response.data.message
            };
        }

        if (response.data.success) {
            const { accessToken, refreshToken, user } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            // refreshToken is now in cookie, but if backend sends it in body for dev, store it?
            // User requested NOT in body. If backend sends it, ignore or store. 
            // My backend implementation removed it from body.
            // localStorage.setItem('refreshToken', refreshToken); // No longer needed if HttpOnly cookie
            localStorage.setItem('user', JSON.stringify(user));
            console.log('✅ AuthService: Login successful.');
        }
        return response.data;
    } catch (error) {
        console.error('❌ AuthService: Login error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Server connection failed' };
    }
};

const verifyLogin2FA = async (tempToken, otp) => {
    try {
        const response = await api.post('/auth/verify-login-2fa', { tempToken, otp });
        if (response.data.success) {
            const { accessToken, user } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('auth-update'));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Verification failed' };
    }
};

const signup = async (name, email, password, role, phone, businessName, website, experience, plan) => {
    try {
        console.log('📬 AuthService: Attempting signup...');
        const response = await api.post('/auth/signup', {
            name,
            email,
            password,
            role,
            phone,
            businessName,
            website,
            experience,
            plan
        });
        // Note: Signup no longer returns tokens, it returns userId for OTP step
        return response.data;
    } catch (error) {
        console.error('❌ AuthService: Signup error:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Server connection failed' };
    }
};

const verifyOtp = async (userId, emailOtp, otp) => {
    try {
        const response = await api.post('/auth/verify-otp', { userId, emailOtp, otp });
        if (response.data.success) {
            const { accessToken, user } = response.data.data;
            if (accessToken) localStorage.setItem('accessToken', accessToken);
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (accessToken || user) window.dispatchEvent(new Event('auth-update'));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Verification failed' };
    }
};

const resendOtp = async (userId, type) => {
    try {
        const response = await api.post('/auth/resend-otp', { userId, type });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Resend failed' };
    }
};

const sendMobileOtp = async (userId, phone) => {
    try {
        const response = await api.post('/auth/send-otp', { userId, phone });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to send mobile OTP' };
    }
};

const verifyMobileOtp = async (userId, otp) => {
    try {
        // The backend verify-otp now expects 'otp' for mobile
        const response = await api.post('/auth/verify-otp', { userId, otp });
        if (response.data.success) {
            const { accessToken, user } = response.data.data;
            if (accessToken) localStorage.setItem('accessToken', accessToken);
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (accessToken || user) window.dispatchEvent(new Event('auth-update'));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Mobile verification failed' };
    }
};

const resendMobileOtp = async (userId, phone) => {
    try {
        const response = await api.post('/auth/resend-otp', { userId, phone, type: 'mobile' });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Resend failed' };
    }
};

const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
        }
    } catch (error) {
        console.error('AuthService: Logout request failed', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        console.log('🚪 AuthService: Logged out locally.');
        window.dispatchEvent(new Event('auth-update')); // Notify app
    }
};

const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Request failed' };
    }
};

const resetPassword = async (token, password) => {
    try {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Reset failed' };
    }
};

const updateAvatar = async (formData) => {
    try {
        const response = await api.post('/auth/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            window.dispatchEvent(new Event('auth-update'));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Avatar upload failed' };
    }
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    try {
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

const authService = {
    api,
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
    getCurrentUser,
    updateAvatar,
    verifyLogin2FA,
    forgotPassword,
    resetPassword,
    sendMobileOtp,
    verifyMobileOtp,
    resendMobileOtp
};

export default authService;
