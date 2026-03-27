const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role, batch, dept } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user (NO EMAIL VERIFICATION)
    const user = new User({
      name,
      email,
      password_hash,
      role: role || 'student',
      batch,
      dept,
      isVerified: true // ✅ auto verified
    });

    await user.save();

    // Response
    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        dept: user.dept
      }
    });

  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    // Check credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ❌ removed email verification check

    // Generate token
    const token = generateToken(user._id);

    // Response
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        batch: user.batch,
        dept: user.dept
      }
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// VERIFY EMAIL (DISABLED BUT KEPT STRUCTURE)
const verifyEmail = async (req, res) => {
  try {
    return res.status(404).json({
      message: 'Email verification feature is disabled'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD (DISABLED BUT KEPT STRUCTURE)
const forgotPassword = async (req, res) => {
  try {
    return res.status(404).json({
      message: 'Forgot password feature is disabled'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD (DISABLED BUT KEPT STRUCTURE)
const resetPassword = async (req, res) => {
  try {
    return res.status(404).json({
      message: 'Reset password feature is disabled'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
};