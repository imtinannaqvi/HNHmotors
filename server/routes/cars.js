import express from 'express';
import {
  getCars,
  getFeaturedCars,
  getSpecialOffers,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────
router.get('/',           getCars);
router.get('/featured',   getFeaturedCars);
router.get('/special',    getSpecialOffers);
router.get('/:id',        getCarById);

// ── Admin Only: Create, Update, Delete ────────────────────
router.post('/',          protect, adminOnly, upload.array('images', 10), createCar);
router.put('/:id',        protect, adminOnly, upload.array('images', 10), updateCar);
router.delete('/:id',     protect, adminOnly, deleteCar);

export default router;