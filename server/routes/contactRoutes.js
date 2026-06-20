import express from 'express';
import { getContacts, deleteContact, toggleContactRead, createContact } from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — the frontend contact form posts here (no login needed)
router.post('/', createContact);

// Admin only — list, mark read, delete (must be logged in as admin)
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, toggleContactRead);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;