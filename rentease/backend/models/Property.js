const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyType: { type: String, enum: ['residential', 'commercial'], required: true },
  adType: { type: String, enum: ['rent', 'sale'], required: true },
  address: { type: String, required: true },
  ownerContact: { type: String, required: true },
  amount: { type: Number, required: true },
  images: [{ type: String }],
  additionalDetails: { type: String },
  availability: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
