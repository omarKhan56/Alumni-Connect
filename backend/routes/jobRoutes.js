const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const Job = require('../models/Job');

// GET ALL JOBS
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name profilePic role')
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE JOB
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      applyLink,
      salary,
      deadline
    } = req.body;

    // ✅ validation
    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const job = await Job.create({
      postedBy: req.user._id,
      title,
      company,
      location,
      type,
      description,
      requirements,
      applyLink,
      salary,
      deadline
    });

    await job.populate('postedBy', 'name profilePic role');

    res.status(201).json(job);

  } catch (err) {
    console.error("CREATE JOB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE JOB (THIS WAS MISSING)
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // 🔐 Only creator can delete
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.deleteOne();

    res.json({ message: 'Job deleted successfully' });

  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;