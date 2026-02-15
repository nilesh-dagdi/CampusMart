import express from 'express';
import { sendMessage, getMyMessages, getMessagesForConversation } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/', getMyMessages);
// router.get('/:otherUserId/:itemId', getMessagesForConversation); // Optional for inbox

export default router;
