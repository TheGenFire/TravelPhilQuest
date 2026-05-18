require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, sameSite: 'lax' } // 1 day
}));

// API Routes
app.use('/', require('./routes/auth'));
app.use('/api/quests', require('./routes/quests'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/profile', require('./routes/profile'));

// Seed quests on startup
const Quest = require('./models/Quest');
async function seedQuests() {
  const count = await Quest.countDocuments();
  if (count === 0) {
    await Quest.insertMany([
      // Daily Quests
      {
        title: 'Rhythm of Cebu',
        location: 'Colon Street',
        description: 'Snap a photo of a live street performance or musician along the historic Colon Street.',
        type: 'daily',
        xp: 20,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Colon_Street_Cebu.jpg/1200px-Colon_Street_Cebu.jpg',
        badgeIcon: '🎵',
        coordinates: { lat: 10.2969, lng: 123.8997 }
      },
      {
        title: 'Carbon Rush',
        location: 'Colon Street',
        description: 'Capture the busiest and most colorful part of Cebu\'s oldest market.',
        type: 'daily',
        xp: 20,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Colon_Street_Cebu.jpg/1200px-Colon_Street_Cebu.jpg',
        badgeIcon: '🛒',
        coordinates: { lat: 10.2950, lng: 123.8980 }
      },
      // Weekly Quests
      {
        title: 'Freedom Frame',
        location: 'Plaza Independencia',
        description: 'Snap a photo near the monument at the center of the plaza.',
        type: 'weekly',
        xp: 50,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Plaza_Independencia_Cebu.jpg/1200px-Plaza_Independencia_Cebu.jpg',
        badgeIcon: '🏛️',
        coordinates: { lat: 10.2935, lng: 123.9029 },
        destination: { name: 'Plaza Independencia', address: '7WV4+73C, Cebu City' }
      },
      {
        title: 'Fort Defender',
        location: 'Fort San Pedro',
        description: 'Snap a creative pose beside the historic stone walls of Cebu\'s oldest fort.',
        type: 'weekly',
        xp: 50,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fort_San_Pedro_Cebu.jpg/1200px-Fort_San_Pedro_Cebu.jpg',
        badgeIcon: '🏰',
        coordinates: { lat: 10.2912, lng: 123.9038 },
        destination: { name: 'Fort San Pedro', address: 'A. Pigafetta St, Cebu City' }
      }
    ]);
    console.log('✅ Quests seeded');
  }
}
seedQuests();

// Serve React app
const reactBuildPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(reactBuildPath));

// Catch-all for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(reactBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
