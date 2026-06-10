import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes    from './routes/auth.js';
import carRoutes     from './routes/cars.js';
import adminRoutes   from './routes/adminRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ── Serve uploaded images statically ──────────────────────
const uploadsPath = path.join(__dirname, 'uploads');

// Create folder if it doesn't exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads folder:', uploadsPath);
}

console.log('Serving uploads from:', uploadsPath); // ← debug line

app.use('/uploads', express.static(uploadsPath));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/cars',     carRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/enquiries', enquiryRoutes);

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(500).json({ message: err.message });
});

// ── DB + Server ───────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('DB error:', err));