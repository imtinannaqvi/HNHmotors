import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    path: { type: String, default: '/' },   // which page was visited
  ip:   { type: String, default: '' },
}, { timestamps: true})

export default mongoose.models.Visit || mongoose.model('Visit', visitSchema)