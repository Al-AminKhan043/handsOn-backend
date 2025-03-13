const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profile: {
    skills: {
      type: [String],
      required: true,
    },
    causes: {
      type: [String],
      required: true,
    },
  },
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Hash password
  this.password = await bcrypt.hash(this.password, 10);
  
  // Remove confirmPassword (don't store it)
  this.confirmPassword = undefined;

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
