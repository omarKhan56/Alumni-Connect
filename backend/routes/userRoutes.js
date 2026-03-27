const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'alumni-connect/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

// ─────────────────────────────────────────────
// ✅ GET PROFILE
// ─────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────
// ✅ UPDATE PROFILE
// ─────────────────────────────────────────────
router.put(
  '/profile',
  protect,
  upload.single('profilePic'),
  async (req, res) => {
    try {
      const updates = { ...req.body };

      // ✅ handle profile image
      if (req.file) {
        updates.profilePic = req.file.path;
      }

      // ✅ safe JSON parse
      if (req.body.skills) {
        try {
          updates.skills = JSON.parse(req.body.skills);
        } catch {
          updates.skills = req.body.skills;
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true }
      ).select('-password_hash');

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ─────────────────────────────────────────────
// ✅ GET ALUMNI LIST
// ─────────────────────────────────────────────
router.get('/alumni', protect, async (req, res) => {
  try {
    const { page = 1, limit = 12, dept, batch, search } = req.query;

    // ❌ removed isVisible (not in your schema)
    const query = { role: 'alumni' };

    if (dept) query.dept = dept;
    if (batch) query.batch = batch;
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await User.countDocuments(query);

    const alumni = await User.find(query)
      .select('-password_hash') // ✅ removed unused fields
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      alumni,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────
// ✅ GET SINGLE USER
// ─────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;