import api from './apiConfig';

export const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const sendOtp = async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
};

export const verifyOtp = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
};
