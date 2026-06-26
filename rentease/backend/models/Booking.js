const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenantName: { type: String, required: true },
  tenantPhone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'booked'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
