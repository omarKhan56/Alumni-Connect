const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const Event = require('../models/Event');

// GET EVENTS
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name profilePic role')
      .sort({ date: 1 });

    res.json(events);

  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE EVENT
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, date, venue, banner } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      banner: banner || '',
      createdBy: req.user._id
    });

    await event.populate('createdBy', 'name profilePic role');

    res.status(201).json(event);

  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;