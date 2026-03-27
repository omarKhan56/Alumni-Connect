const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// GET CONVERSATIONS
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$content' },
          updatedAt: { $first: '$createdAt' }
        }
      }
    ]);

    res.json(conversations);

  } catch (err) {
    console.error("CONVERSATION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET MESSAGES BETWEEN 2 USERS
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// SEND MESSAGE (fallback API)
router.post('/', protect, async (req, res) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const msg = await Message.create({
      sender: req.user._id,
      receiver,
      content
    });

    res.status(201).json(msg);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;