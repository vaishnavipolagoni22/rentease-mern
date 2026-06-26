const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { authMiddleware, ownerMiddleware } = require('../middleware/auth');

// Create booking (renter)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { propertyId, tenantName, tenantPhone } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (!property.availability) return res.status(400).json({ message: 'Property not available' });

    const booking = new Booking({
      owner: property.owner,
      property: propertyId,
      tenant: req.user.id,
      tenantName,
      tenantPhone,
      status: 'pending'
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get renter's bookings
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id }).populate('property');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get owner's bookings
router.get('/owner', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id }).populate('property tenant');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status (owner)
router.put('/:id/status', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // If booked, mark property unavailable
    if (req.body.status === 'booked') {
      await Property.findByIdAndUpdate(booking.property, { availability: false });
    } else if (req.body.status === 'pending') {
      await Property.findByIdAndUpdate(booking.property, { availability: true });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
