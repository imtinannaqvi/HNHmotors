import Contact from "../models/Contact.js";

// POST /api/contact — public (frontend form posts here)
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/contact — admin (list all, newest first)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/contact/:id/read — toggle read/unread
export const toggleContactRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Message not found" });
    contact.isRead = req.body.isRead ?? !contact.isRead;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/contact/:id
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};