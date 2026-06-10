import express from 'express';
import Car from '../models/Car.js';
import User from '../models/User.js';
import Enquiry from '../models/Enquiry.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper: read a value from a car's details object, case-insensitively
const getDetail = (car, key) => {
  if (!car.details || typeof car.details !== 'object') return '';
  const entry = Object.entries(car.details).find(([k]) => k.toLowerCase() === key.toLowerCase());
  return entry ? String(entry[1]) : '';
};

// ── Stats endpoint ────────────────────────────────────────
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalCars, totalUsers, soldCars,
      recentCars, recentUsers,
      specialOffers, allCars, totalEnquiries,
    ] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments(),
      Car.countDocuments({ status: 'sold' }),
      Car.find().sort({ createdAt: -1 }).limit(5).select('title details createdAt thumbnail'),
      User.find().sort({ createdAt: -1 }).limit(4).select('name email role createdAt'),
      Car.countDocuments({ isSpecialOffer: true }),
      Car.find().select('price details'),
      Enquiry.countDocuments(),
    ]);

    // Total inventory value
    const inventoryValue = allCars.reduce((sum, c) => sum + (c.price || 0), 0);

    // Brand breakdown (read from details)
    const brandMap = {};
    allCars.forEach(c => {
      const brand = getDetail(c, 'brand');
      if (brand) brandMap[brand] = (brandMap[brand] || 0) + 1;
    });
    const brandBreakdown = Object.entries(brandMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([brand, count]) => ({ brand, count }));

    // Category breakdown (read from details)
    const categoryMap = {};
    allCars.forEach(c => {
      const category = getDetail(c, 'category');
      if (category) categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }));

    res.json({
      cars: totalCars,
      users: totalUsers,
      inquiries: totalEnquiries,
      sold: soldCars,
      specialOffers,
      inventoryValue,
      recentCars,
      recentUsers,
      brandBreakdown,
      categoryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── User management routes ────────────────────────────────
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;