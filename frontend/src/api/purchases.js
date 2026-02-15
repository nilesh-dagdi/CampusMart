import api from './apiConfig';

export const initiatePurchase = async (itemId) => {
    const response = await api.post('/purchases/initiate', { itemId });
    return response.data;
};

export const confirmPurchase = async (purchaseId) => {
    const response = await api.post('/purchases/confirm', { purchaseId });
    return response.data;
};

export const getMyPurchases = async () => {
    const response = await api.get('/purchases/my-purchases');
    return response.data;
};
