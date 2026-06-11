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

// Accept car images (up to 10) + one brand logo
const carUploads = upload.fields([
  { name: 'images',    maxCount: 10 },
  { name: 'brandLogo', maxCount: 1  },
]);

// ── Public Routes ─────────────────────────────────────────
router.get('/',           getCars);
router.get('/featured',   getFeaturedCars);
router.get('/special',    getSpecialOffers);
router.get('/:id',        getCarById);

// ── Admin Only: Create, Update, Delete ────────────────────
router.post('/',          protect, adminOnly, carUploads, createCar);
router.put('/:id',        protect, adminOnly, carUploads, updateCar);
router.delete('/:id',     protect, adminOnly, deleteCar);

export default router;