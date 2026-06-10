import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  message:  { type: String, default: '' },
  remarks:  { type: String, default: '' },
  carId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  carTitle: { type: String, default: '' },
  stockId:  { type: String, default: '' },
  isRead:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);