import { Router } from 'express';
import { uploadFiles } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', protect, upload.array('files', 10), uploadFiles);

export default router;
