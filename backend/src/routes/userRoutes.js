import express from 'express';
import { getProfile, updateProfile, changePassword, deleteProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);
router.post('/change-password', changePassword);

export default router;
