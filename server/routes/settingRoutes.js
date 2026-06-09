// File: D:\motors\server\routes\settingsRoutes.js
import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect, dealerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, dealerOnly, updateSettings);

export default router;