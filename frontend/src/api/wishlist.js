import api from './apiConfig';

/**
 * Get user's wishlist
 */
export const getWishlist = async () => {
    const response = await api.get('/wishlist');
    return response.data;
};

/**
 * Add item to wishlist
 */
export const addToWishlist = async (itemId) => {
    const response = await api.post(`/wishlist/${itemId}`);
    return response.data;
};

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (itemId) => {
    const response = await api.delete(`/wishlist/${itemId}`);
    return response.data;
};
