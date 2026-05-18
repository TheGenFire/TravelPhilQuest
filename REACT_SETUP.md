# TravelPHIL Quest - React Frontend Setup

## Project Structure

```
questapp/
├── server.js                 # Express backend
├── package.json              # Backend dependencies
├── .env                      # Environment variables
├── routes/                   # API routes (refactored to JSON)
├── models/                   # Mongoose models
├── middleware/               # Auth middleware
├── public/                   # Static files (uploads)
└── client/                   # React + Vite frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Quests.jsx
        │   ├── Profile.jsx
        │   ├── Map.jsx
        │   ├── Upload.jsx
        │   └── Complete.jsx
        └── components/
            └── BottomNav.jsx
```

## Installation & Setup

### 1. Install Backend Dependencies
```bash
cd questapp
npm install
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
```

### 3. Environment Variables

Make sure your `.env` file in the root questapp folder contains:
```
MONGODB_URI=mongodb://localhost:27017/lovephilippines
SESSION_SECRET=lovethephilippines_secret_key_2024
PORT=3000
```

### 4. MongoDB Setup

Ensure MongoDB is running:
```bash
# Windows
mongod

# Or use MongoDB Atlas (cloud)
```

## Running the App

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

This will run:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173 (with API proxy to backend)

### Just Backend
```bash
npm run server:dev
```

### Just Frontend
```bash
cd client
npm run dev
```

### Production Build
```bash
npm run build
```

Then start the server:
```bash
npm start
```

The Express server will serve the React build from the `client/dist` folder.

## API Endpoints

All routes now return JSON responses:

### Auth
- `GET /api/check-auth` - Check if user is authenticated
- `POST /api/login` - Login with email/password
- `POST /api/register` - Register new account
- `POST /api/logout` - Logout user

### Quests
- `GET /api/quests/api/all` - Get all quests and user progress
- `GET /api/quests/api/:id` - Get single quest details

### Profile
- `GET /api/profile/api` - Get user profile and submissions
- `PUT /api/profile/api` - Update user profile

### Uploads
- `POST /api/uploads/:questId/submit` - Submit quest completion with photo

## Key Changes Made

1. **Backend**: Converted all routes to return JSON instead of rendering EJS templates
2. **Frontend**: Created React SPA with React Router for navigation
3. **Styling**: Moved from CSS files to a single modular CSS file
4. **State Management**: Using React hooks (useState, useEffect) for state
5. **API Communication**: Using Axios for HTTP requests
6. **Build**: Using Vite for fast development and optimized production builds

## Features Implemented

✅ User Authentication (Login/Register)
✅ Quest System (Daily/Weekly quests)
✅ Photo Upload with Gallery/Camera
✅ User Profile with Stats
✅ Quest Completion Tracking
✅ XP & Level System
✅ Bottom Navigation
✅ Responsive Design

## Development Tips

- The Vite dev server proxies `/api` requests to the backend
- Hot Module Replacement (HMR) is enabled in development
- All API responses use JSON format
- Session management is handled via HTTP-only cookies
- MongoDB stores all data (users, quests, submissions)

## Troubleshooting

**Issue**: Port 3000 already in use
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Issue**: MongoDB connection error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP

**Issue**: Uploads folder not found
- The Express server auto-creates it in `public/uploads`
- Ensure you have write permissions

## Next Steps

1. Install dependencies: `npm install && cd client && npm install`
2. Ensure MongoDB is running
3. Run `npm run dev` to start both frontend and backend
4. Open http://localhost:5173 in your browser
5. Register a new account and explore quests!

