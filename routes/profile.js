const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuestSubmission = require('../models/QuestSubmission');
const requireAuth = require('../middleware/auth');

// GET /api/profile
router.get('/api', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('completedQuests');
    const submissions = await QuestSubmission.find({ user: user._id })
      .populate('quest')
      .sort({ createdAt: -1 });
    res.json({ user, submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load profile' });
  }
});

// PUT /api/profile - Update user profile
router.put('/api', requireAuth, async (req, res) => {
  try {
    const { displayName, pronouns, bio, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { displayName, pronouns, bio, avatarUrl },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

module.exports = router;
