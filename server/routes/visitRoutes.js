import { getVisitCount, logVisit } from "../controllers/visitController.js";
import express from 'express';

const router = express.Router();

router.post('/', logVisit);        // public — log a visit
router.get('/count', getVisitCount);

export default router;