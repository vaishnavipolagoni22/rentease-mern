const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Property = require('../models/Property');
const { authMiddleware, ownerMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
// Get all properties (public)
router.get("/", async (req, res) => {
  try {
    const { address, adType, propertyType } = req.query;

    const filter = {};

    if (address)
      filter.address = { $regex: address, $options: "i" };

    if (adType)
      filter.adType = adType;

    if (propertyType)
      filter.propertyType = propertyType;

    let properties = await Property.find(filter).populate(
      "owner",
      "name email"
    );

   
    res.json(properties);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
// Get owner's properties
router.get('/my', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add property (owner only)
router.post('/', authMiddleware, ownerMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { propertyType, adType, address, ownerContact, amount, additionalDetails } = req.body;
    const images = req.files ? req.files.map(f => f.filename) : [];
    const property = new Property({
      owner: req.user.id,
      propertyType, adType, address, ownerContact,
      amount: Number(amount),
      images,
      additionalDetails
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update property
router.put('/:id', authMiddleware, ownerMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: req.user.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const updates = req.body;
    if (req.files && req.files.length > 0) updates.images = req.files.map(f => f.filename);
    Object.assign(property, updates);
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete property
router.delete('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
