const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Quest = require('../models/Quest');
const QuestSubmission = require('../models/QuestSubmission');
const requireAuth = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed.'));
  }
});

// POST /uploads-route/:questId/submit
router.post('/:questId/submit', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const quest = await Quest.findById(req.params.questId);

    if (!quest || !req.file) {
      return res.status(400).json({ success: false, message: 'Quest or photo missing.' });
    }

    const imageUrl = '/uploads/' + req.file.filename;
    const { description, title } = req.body;

    // Save submission
    const submission = await QuestSubmission.create({
      user: user._id,
      quest: quest._id,
      imageUrl,
      title: title || `${quest.title} #${quest.location.replace(/\s/g, '')} #CebuCity`,
      description: description || '',
      location: quest.location,
      xpEarned: quest.xp
    });

    // Update user XP and completed quests
    if (!user.completedQuests.includes(quest._id)) {
      user.completedQuests.push(quest._id);
      user.xp += quest.xp;
      // Level up logic: every 500 XP = 1 level
      const newLevel = Math.floor(user.xp / 500) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }
      user.streak = (user.streak || 0) + 1;
      await user.save();
    }

    res.json({
      success: true,
      xpEarned: quest.xp,
      newXp: user.xp,
      level: user.level,
      xpForNext: user.level * 500,
      questTitle: quest.title
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
});

// POST /uploads-route/avatar - Upload user avatar
router.post('/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No avatar file provided.' });
    }

    const avatarUrl = '/uploads/' + req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      user,
      message: 'Avatar updated successfully.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Avatar upload failed.' });
  }
});

module.exports = router;
