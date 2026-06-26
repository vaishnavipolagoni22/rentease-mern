const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Grant/Ungrant owner access
router.put('/users/:id/grant', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.granted = !user.granted;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all properties
router.get('/properties', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings
router.get('/bookings', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('owner tenant property');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
