import express from 'express';
import { initiatePurchase, confirmPurchase, getMyPurchases } from '../controllers/purchaseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/initiate', initiatePurchase);
router.post('/confirm', confirmPurchase);
router.get('/my-purchases', getMyPurchases);

export default router;
