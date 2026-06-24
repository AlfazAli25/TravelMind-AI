import { Router } from 'express';
import {
  generate,
  getAll,
  getById,
  remove,
  getStats,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/generate', generate);
router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:id', getById);
router.delete('/:id', remove);

export default router;
