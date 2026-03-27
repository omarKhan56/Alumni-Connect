const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },

  role: {
    type: String,
    enum: ['admin', 'alumni', 'student'],
    default: 'student'
  },

  profilePic: { type: String, default: '' },
  batch: { type: String, default: '' },
  dept: { type: String, default: '' },
  currentRole: { type: String, default: '' },
  currentCompany: { type: String, default: '' },

  // ✅ NOW ALWAYS TRUE
  isVerified: { type: Boolean, default: true },

  verificationToken: String,
  verificationExpiry: Date,

  resetPasswordToken: String,
  resetPasswordExpiry: Date,

},
{ timestamps: true }
);

// 🔐 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

// (kept but unused now)
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.verificationToken = token;
  this.verificationExpiry = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = token;
  this.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;

  return token;
};

module.exports = mongoose.model('User', userSchema);