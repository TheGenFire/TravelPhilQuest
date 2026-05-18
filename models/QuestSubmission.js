const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true },
  imageUrl: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  xpEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestSubmission', submissionSchema);
