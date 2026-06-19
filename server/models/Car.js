import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({

  // ── Basic Info ────────────────────────────────────────────
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true },

  // ── Custom details (your own label/value pairs) ──────────
  details: { type: mongoose.Schema.Types.Mixed, default: {} },

  // ── Features ──────────────────────────────────────────────
  features: [{ type: String }],

  // ── Images ────────────────────────────────────────────────
  images:    [{ type: String }],
  thumbnail: { type: String },

  // ── Special Offer ─────────────────────────────────────────
  isSpecialOffer:  { type: Boolean, default: false },
  discountedPrice: { type: Number, default: null },
  offerLabel:      { type: String, default: '' },

  // ── Flags ─────────────────────────────────────────────────
  isFeatured: { type: Boolean, default: false },
  brandLogo: { type: String, default: '' },

}, { timestamps: true });

export default mongoose.model('Car', carSchema);