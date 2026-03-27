const express = require('express');
const router = express.Router();

const { protect, requireRole } = require('../middleware/authMiddleware');
const { Mentorship, User } = require('../models');
const { sendEmail } = require('../utils/email');

// Student requests mentorship
router.post('/request', protect, requireRole('student'), async (req, res) => {
  try {
    const existing = await Mentorship.findOne({
      student: req.user._id,
      mentor: req.body.mentorId,
      status: { $in: ['pending', 'active'] }
    });

    if (existing) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    const mentorship = await Mentorship.create({
      student: req.user._id,
      mentor: req.body.mentorId,
      message: req.body.message,
      goals: req.body.goals
    });

    const admins = await User.find({ role: 'admin' });

    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: 'New Mentorship Request',
        html: `<p>A new mentorship request awaits approval.</p>`
      });
    }

    res.status(201).json(mentorship);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get mentorships
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') query.student = req.user._id;
    if (req.user.role === 'alumni') query.mentor = req.user._id;

    const requests = await Mentorship.find(query)
      .populate('student', 'name profilePic email dept batch')
      .populate('mentor', 'name profilePic email currentRole currentCompany')
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin approves/rejects
router.put('/:id/approve', protect, requireRole('admin'), async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    if (!mentorship) {
      return res.status(404).json({ message: 'Not found' });
    }

    mentorship.status = req.body.status || 'active';
    await mentorship.save();

    await sendEmail({
      to: mentorship.student.email,
      subject: `Mentorship ${mentorship.status}`,
      html: `<p>Your request with ${mentorship.mentor.name} is ${mentorship.status}.</p>`
    });

    await sendEmail({
      to: mentorship.mentor.email,
      subject: `Mentorship Assignment`,
      html: `<p>Request from ${mentorship.student.name} is ${mentorship.status}.</p>`
    });

    res.json(mentorship);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;