import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware);

router.get('/', getWishlist);
router.post('/:itemId', addToWishlist);
router.delete('/:itemId', removeFromWishlist);

export default router;
