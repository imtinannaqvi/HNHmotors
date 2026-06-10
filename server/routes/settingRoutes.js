import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadLogo } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, adminOnly, uploadLogo.single('logo'), updateSettings);

export default router;