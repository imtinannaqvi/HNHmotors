import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Go up one level from middleware/ to server/ ───────────
const carDir  = path.join(__dirname, '../uploads/cars');
const logoDir = path.join(__dirname, '../uploads/logo');

[carDir, logoDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime    = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
};

const carStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carDir),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `car-${unique}${path.extname(file.originalname)}`);
  },
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, logoDir),
  filename:    (req, file, cb) => {
    cb(null, `logo${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: carStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadLogo = multer({ storage: logoStorage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

export default upload;