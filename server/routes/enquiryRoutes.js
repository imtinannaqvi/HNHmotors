import express from 'express';
import { createEnquiry, getEnquiries, deleteEnquiry } from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/', createEnquiry);        // public — anyone can submit
router.get('/', getEnquiries);          // admin — add auth middleware if you have it
router.delete('/:id', deleteEnquiry);   // admin

export default router;