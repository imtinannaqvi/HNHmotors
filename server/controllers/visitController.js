import Visit from '../models/visit.js';

// POST /api/visits — public, called once when the site loads
export const logVisit = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    await Visit.create({ path: req.body.path || '/', ip });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/visits/count — total visits (for the number on dashboard)
export const getVisitCount = async (req, res) => {
  try {
    const total = await Visit.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};