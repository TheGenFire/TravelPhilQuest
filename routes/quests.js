const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

// GET /api/quests - Get all quests for user
router.get('/api/all', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate('completedQuests');
    const dailyQuests = await Quest.find({ type: 'daily' });
    const weeklyQuests = await Quest.find({ type: 'weekly' });
    const completedIds = user.completedQuests.map(q => q._id.toString());
    res.json({ 
      user, 
      dailyQuests, 
      weeklyQuests, 
      completedIds 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load quests' });
  }
});

// GET /api/quests/:id - Get single quest
router.get('/api/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const quest = await Quest.findById(req.params.id);
    if (!quest) return res.status(404).json({ success: false, error: 'Quest not found' });
    res.json({ user, quest });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load quest' });
  }
});

module.exports = router;
