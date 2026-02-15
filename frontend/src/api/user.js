import api from './apiConfig';

export const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
};

export const deleteAccount = async () => {
    const response = await api.delete('/users/profile');
    return response.data;
};

export const changePassword = async (passwords) => {
    const response = await api.post('/users/change-password', passwords);
    return response.data;
};
