import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  propertyId: { type: String, required: true },
  propertyTitle: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, enum: ['Viewing', 'Consultation'], required: true },
  status: { type: String, enum: ['Confirmed', 'Pending'], default: 'Pending' },
  customer: { type: String, required: true },
  username: { type: String, required: true, index: true }
}, { timestamps: true, versionKey: false });

export const Booking = mongoose.model('Booking', bookingSchema);
