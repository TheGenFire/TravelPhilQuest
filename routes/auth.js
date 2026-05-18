const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/check-auth
router.get('/api/check-auth', (req, res) => {
  if (req.session.userId) {
    return res.json({ authenticated: true, userId: req.session.userId });
  }
  res.json({ authenticated: false });
});

// POST /api/login
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    req.session.userId = user._id;
    res.json({ 
      success: true, 
      userId: user._id, 
      user: { 
        id: user._id, 
        username: user.username, 
        displayName: user.displayName, 
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        avatarUrl: user.avatarUrl
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// POST /api/register
router.post('/api/register', async (req, res) => {
  try {
    const { username, displayName, email, password, pronouns } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email or username already taken.' });
    }
    const user = await User.create({ username, displayName, email, password, pronouns: pronouns || 'he/him' });
    req.session.userId = user._id;
    res.json({ 
      success: true, 
      userId: user._id, 
      user: { 
        id: user._id, 
        username: user.username, 
        displayName: user.displayName, 
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        avatarUrl: user.avatarUrl
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// POST /api/logout
router.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, error: 'Logout failed' });
    res.json({ success: true });
  });
});

module.exports = router;
