import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const hasToken = !!localStorage.getItem('token');
            // Clear token and redirect to login if session expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if they WERE logged in (session expired)
            // or if the request was specifically for a protected resource that shouldn't have been hit
            if (hasToken) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
