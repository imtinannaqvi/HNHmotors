import Enquiry from '../models/Enquiry.js';

// POST create enquiry
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, carId, carTitle, stockId } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email and phone are required' });
    }
    const enquiry = await Enquiry.create({ name, email, phone, message, carId, carTitle, stockId });
    res.status(201).json({ message: 'Enquiry sent successfully', enquiry });
  } catch (err) {
    console.error('CREATE ENQUIRY ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET all enquiries (admin)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ enquiries, total: enquiries.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE enquiry (admin)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};