import express from 'express';
import { createCar, deleteCar, updateCar, getCars, getCarById } from '../controllers/carController.js'; // Ensure getCarById is exported
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Fetch all cars
router.get('/cars', getCars);

// Fetch ONE car (This was missing!)
router.get('/cars/:id', getCarById); 

// Create car
router.post('/cars', protect, upload.array('images', 10), createCar);

// Update car
router.put('/cars/:id', protect, upload.array('images', 10), updateCar);

// Delete car
router.delete('/cars/:id', protect, deleteCar);

export default router;