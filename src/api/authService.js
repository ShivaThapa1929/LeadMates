import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
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

        // If error is 401 and it's not a retry and not an auth route that shouldn't be retried
        const isAuthRoute = originalRequest.url.includes('/auth/login') ||
            originalRequest.url.includes('/auth/logout') ||
            originalRequest.url.includes('/auth/refresh-token');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;

            if (isRefreshing) {
                console.log('⏳ AuthService: Refresh already in progress, queuing request...');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                console.log('🔄 AuthService: Access token expired. Attempting refresh...');
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });

                if (response.data.success) {
                    const { accessToken } = response.data.data;
                    console.log('✅ AuthService: Token refreshed successfully.');
                    localStorage.setItem('accessToken', accessToken);

                    processQueue(null, accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                const status = refreshError.response?.status;
                console.error(`❌ AuthService: Refresh failed (Status: ${status || 'Network Error'}).`);

                // If the refresh call itself is 401, we MUST logout
                if (status === 401 || status === 403) {
                    await logout();
                    if (window.location.pathname.startsWith('/dashboard')) {
                        window.location.href = '/login';
                    }
                }
            } finally {
                isRefreshing = false;
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
            window.dispatchEvent(new Event('auth-update'));
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



const logout = async () => {
    try {
        await api.post('/auth/logout');
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

const resetPassword = async (userId, otp, password) => {
    try {
        const response = await api.post('/auth/reset-password', { userId, otp, password });
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
    resetPassword
}; // resetPassword(userId, otp, password)

export default authService;
