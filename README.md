# 🇵🇭 Love the Philippines – Quest System

A web application implementing the **Quest flow** from the "Love the Philippines" tourism gamification app. Built with Node.js, Express, MongoDB, and EJS. Designed as a mobile-width web app.

---

## 📁 Project Structure

```
questapp/
├── server.js               # Main Express server + MongoDB connect + quest seeding
├── .env                    # Environment variables (edit this!)
├── package.json
├── middleware/
│   └── auth.js             # Session-based auth guard
├── models/
│   ├── User.js             # User schema (XP, level, streak, completedQuests)
│   ├── Quest.js            # Quest schema (daily/weekly, location, XP reward)
│   └── QuestSubmission.js  # Photo evidence per quest per user
├── routes/
│   ├── auth.js             # GET/POST /login, /register, /logout
│   ├── quests.js           # Quest tab, map, select-media, upload, complete pages
│   ├── uploads.js          # POST /uploads-route/:questId/submit (multer)
│   └── profile.js          # GET /profile
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── quests.ejs          # Main quest tab (Daily + Weekly)
│   ├── map.ejs             # Location tracking with Leaflet.js
│   ├── select-media.ejs    # Gallery or Camera choice
│   ├── upload.ejs          # Camera capture or gallery picker
│   ├── new-upload.ejs      # Add description before submitting
│   ├── complete.ejs        # Upload complete + XP gained
│   ├── profile.ejs         # User profile + gallery
│   └── partials/
│       └── bottom-nav.ejs
└── public/
    ├── css/style.css
    └── uploads/            # Stored quest photos (auto-created)
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** running locally — https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud): update `MONGODB_URI` in `.env`

### 2. Install dependencies

```bash
cd questapp
npm install
```

### 3. Configure environment

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/lovephilippines
SESSION_SECRET=lovethephilippines_secret_key_2024
PORT=3000
```

For MongoDB Atlas, replace the URI with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lovephilippines
```

### 4. Run the app

```bash
npm start
```

Or with auto-reload during development:
```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## 🗺️ Quest Flow (the one coded flow)

```
Register / Login
      ↓
Quest Tab (/quests)
  - Browse Daily Quests
  - Browse Weekly Quests (scroll down)
      ↓
Click a Quest → Location Tracking Map (/quests/:id/map)
  - Interactive Leaflet.js map
  - Shows route from current location to quest destination
      ↓
Click "I'm at the location" → Select Media (/quests/:id/select-media)
  - Choose: Gallery or Camera
      ↓
Upload page (/quests/:id/upload?mode=gallery|camera)
  - Gallery: drag-drop or file picker
  - Camera: live webcam capture
      ↓
New Upload (/quests/:id/new-upload)
  - Preview photo + mini map
  - Add optional description
  - Click Upload → submits to backend via FormData
      ↓
Upload Complete (/quests/:id/complete)
  - Confetti animation
  - Shows XP gained + level progress
  - Click "Okay" → redirected to Profile
      ↓
Profile (/profile)
  - View gallery of all uploaded quest photos
  - View completed quests collection
```

---

## 🗄️ Database Collections

### `users`
| Field | Type | Description |
|-------|------|-------------|
| username | String | Unique @handle |
| displayName | String | Full display name |
| email | String | Unique email |
| password | String | Bcrypt hashed |
| level | Number | Starts at 1 |
| xp | Number | Total XP earned |
| streak | Number | Daily login streak |
| completedQuests | ObjectId[] | Ref to Quest |

### `quests`
| Field | Type | Description |
|-------|------|-------------|
| title | String | Quest name |
| location | String | Landmark name |
| description | String | What to do |
| type | String | `daily` or `weekly` |
| xp | Number | XP reward |
| badgeIcon | String | Emoji badge |
| coordinates | Object | `{lat, lng}` |
| destination | Object | `{name, address}` |

### `questsubmissions`
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Ref to User |
| quest | ObjectId | Ref to Quest |
| imageUrl | String | Path to uploaded photo |
| title | String | Auto-generated title |
| description | String | User-entered caption |
| xpEarned | Number | XP awarded |

---

## 🔑 Notes

- **Photos** are stored in `public/uploads/` on the server filesystem.
- **Camera** uses the browser's `getUserMedia` API (requires HTTPS or localhost).
- **Map** uses Leaflet.js + OpenStreetMap (no API key needed).
- Quests are **seeded automatically** on first run if none exist.
- The app uses **express-session** with MongoDB session store — sessions persist across server restarts.

---

## 🧪 Quick Test

1. Go to http://localhost:3000
2. Click "Sign up" → create an account
3. You'll land on the Quest tab
4. Click "Freedom Frame" (weekly quest)
5. Follow the flow: Map → Select Media → Upload → Complete → Profile
