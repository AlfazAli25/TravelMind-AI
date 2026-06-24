import { Router } from 'express';
import { sendMessage, getHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/:itineraryId', sendMessage);
router.get('/:itineraryId', getHistory);

export default router;
