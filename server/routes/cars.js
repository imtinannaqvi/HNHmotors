import express from 'express';
import {
  getCars,
  getFeaturedCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
} from '../controllers/carController.js';
import { protect, dealerOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────
router.get('/',          getCars);
router.get('/featured',  getFeaturedCars);
router.get('/my',        protect, getMyCars);
router.get('/:id',       getCarById);

// ── Protected Routes (dealer/admin only) ──────────────────
router.post(
  '/',
  protect,
  dealerOnly,
  upload.array('images', 10), // max 10 images
  createCar
);

router.put(
  '/:id',
  protect,
  dealerOnly,
  upload.array('images', 10),
  updateCar
);

router.delete('/:id', protect, dealerOnly, deleteCar);

export default router;