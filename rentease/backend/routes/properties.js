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

    if (properties.length === 0) {
      properties = [
        {
          _id: "1",
          title: "Luxury Apartment",
          address: "Gachibowli, Hyderabad",
          propertyType: "Apartment",
          adType: "rent",
          ownerContact: "9876543210",
          amount: 25000,
          availability: true,
          image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900"
        },
        {
          _id: "2",
          title: "Royal Villa",
          address: "Jubilee Hills, Hyderabad",
          propertyType: "Villa",
          adType: "rent",
          ownerContact: "9988776655",
          amount: 65000,
          availability: true,
          image:
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900"
        },
        {
          _id: "3",
          title: "Sky Residency",
          address: "Whitefield, Bangalore",
          propertyType: "3 BHK",
          adType: "rent",
          ownerContact: "9123456789",
          amount: 32000,
          availability: true,
          image:
            "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900"
        },
        {
          _id: "4",
          title: "Sunrise PG",
          address: "Madhapur, Hyderabad",
          propertyType: "PG",
          adType: "rent",
          ownerContact: "9000000000",
          amount: 8000,
          availability: true,
          image:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900"
        },
        {
          _id: "5",
          title: "Elite Homes",
          address: "Anna Nagar, Chennai",
          propertyType: "2 BHK",
          adType: "rent",
          ownerContact: "9012345678",
          amount: 22000,
          availability: true,
          image:
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900"
        }
      ];
    }

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
