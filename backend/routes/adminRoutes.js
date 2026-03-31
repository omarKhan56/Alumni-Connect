const express = require('express');
const router = express.Router();

const { protect, requireRole } = require('../middleware/authMiddleware');
const { User, Post, Event, Job, Mentorship } = require('../models');

// Analytics
router.get('/analytics', protect, requireRole('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalAlumni,
      totalStudents,
      totalPosts,
      totalEvents,
      totalJobs,
      pendingMentorships
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'alumni' }),
      User.countDocuments({ role: 'student' }),
      Post.countDocuments(),
      Event.countDocuments(),
      Job.countDocuments(),
      Mentorship.countDocuments({ status: 'pending' }),
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt profilePic');

    res.json({
      totalUsers,
      totalAlumni,
      totalStudents,
      totalPosts,
      totalEvents,
      totalJobs,
      pendingMentorships,
      recentUsers
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password_hash')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role
router.put('/users/:id/role', protect, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password_hash');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get mentorships
router.get('/mentorships', protect, requireRole('admin'), async (req, res) => {
  try {
    const mentorships = await Mentorship.find()
      .populate('student', 'name email profilePic')
      .populate('mentor', 'name email profilePic')
      .sort({ createdAt: -1 });

    res.json(mentorships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;