const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');

// GET ALL POSTS
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePic role')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });

     res.json({ posts });
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE POST ✅ FIXED
router.post('/', protect, async (req, res) => {
  try {
    const { content, media } = req.body;

    // ❌ prevent empty posts
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    // ❌ ensure user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      media: media || ''
    });

    await post.populate('author', 'name profilePic role');

    res.status(201).json(post);

  } catch (err) {
    console.error("CREATE POST ERROR:", err); // 🔥 THIS WILL SHOW REAL ERROR
    res.status(500).json({ message: err.message });
  }
});

// LIKE POST
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);

    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes.length });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// COMMENT
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();

    await post.populate('comments.user', 'name profilePic');

    res.status(201).json(post.comments);

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;