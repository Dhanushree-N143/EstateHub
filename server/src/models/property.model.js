import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  city: { type: String, required: true },
  community: { type: String, required: true },
  category: { type: String, enum: ['sale', 'rent', 'invest'], required: true },
  type: { type: String, enum: ['apartment', 'villa', 'studio', 'penthouse'], required: true },
  price: { type: Number, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  sqft: { type: Number, required: true },
  tag: { type: String, required: true },
  colors: { type: [String], required: true },
  image: { type: String, required: true }
}, { timestamps: true, versionKey: false });

export const Property = mongoose.model('Property', propertySchema);
