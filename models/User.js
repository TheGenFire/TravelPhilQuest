const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pronouns: { type: String, default: 'he/him' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  bio: { type: String, default: 'so fulfilled!' },
  avatarUrl: { type: String, default: '' },
  completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// XP thresholds per level
userSchema.methods.xpForNextLevel = function () {
  return this.level * 500;
};

module.exports = mongoose.model('User', userSchema);
