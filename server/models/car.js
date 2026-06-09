import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({

  // ── Basic Info ────────────────────────────────────────────
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  price:        { type: Number, required: true },

  // ── Category & Brand ──────────────────────────────────────
  category: {
    type: String,
    required: true,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van', 'Convertible', 'Wagon'],
  },
  brand: {
  type: String,
  required: true,
},

  // ── Images ────────────────────────────────────────────────
  images:       [{ type: String }],       // array of image paths
  thumbnail:    { type: String },         // main display image

  // ── Car Specs ─────────────────────────────────────────────
  make:         { type: String },         // e.g. Toyota
  model:        { type: String },         // e.g. Corolla
  year:         { type: Number },
  mileage:      { type: Number, default: 0 },
  color:        { type: String },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'],
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Certified Pre-Owned'],
    default: 'Used',
  },
  

  // ── Features ──────────────────────────────────────────────
  features: [{ type: String }],           // e.g. ['Sunroof', 'GPS', 'Leather Seats']

  // ── Location & Status ─────────────────────────────────────
  
  isFeatured:   { type: Boolean, default: false },

  

}, { timestamps: true });

export default mongoose.model('Car', carSchema);