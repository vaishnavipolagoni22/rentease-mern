const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
  granted: { type: Boolean, default: false } // for owner approval by admin
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
