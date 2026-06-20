import Car from '../models/car.js';      // adjust import names to match your files
import User from '../models/user.js';
import Enquiry from '../models/Enquiry.js';   // your enquiry model
import Contact from '../models/contact.js';
import Visit from '../models/visit.js';

// Build last-7-days counts for any model with a createdAt field
const buildDailyTrend = async (Model, days = 7) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));

  const records = await Model.find({ createdAt: { $gte: start } }).select('createdAt');

  const buckets = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  records.forEach((r) => {
    const key = new Date(r.createdAt).toISOString().slice(0, 10);
    if (key in buckets) buckets[key] += 1;
  });
  return buckets;
};

// GET /api/stats
export const getStats = async (req, res) => {
  try {
    // Totals (the big numbers)
    const cars      = await Car.countDocuments();
    const users     = await User.countDocuments();
    const inquiries = await Enquiry.countDocuments();
    const contacts  = await Contact.countDocuments();
    const visits    = await Visit.countDocuments();

    // Recent lists
    const recentCars  = await Car.find().sort({ createdAt: -1 }).limit(5).select('title thumbnail createdAt');
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role');

    // 7-day trends
    const enquiryTrend = await buildDailyTrend(Enquiry);
    const contactTrend = await buildDailyTrend(Contact);
    const visitTrend   = await buildDailyTrend(Visit);

    const activityTrend = Object.keys(enquiryTrend).map((date) => ({
      date,
      enquiries: enquiryTrend[date],
      contacts:  contactTrend[date],
      visits:    visitTrend[date],
    }));

    res.json({
      cars, users, inquiries, contacts, visits,
      recentCars, recentUsers,
      activityTrend,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};