const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: String,
  lastName: String,
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CherryBlossom'
  }],
  notificationPreferences: {
    bloomReminder: { type: Boolean, default: true },
    weatherAlerts: { type: Boolean, default: true },
    newLocations: { type: Boolean, default: false }
  },
  region: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// 密码加密
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 密码验证方法
userSchema.methods.comparePassword = async function(inputPassword) {
  return await bcryptjs.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
