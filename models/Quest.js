const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly'], required: true },
  xp: { type: Number, default: 20 },
  imageUrl: { type: String, default: '' },
  badgeIcon: { type: String, default: '🗺️' },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  destination: {
    name: { type: String },
    address: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quest', questSchema);
