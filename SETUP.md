# Setup & Installation Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v14+ installed (`node --version`)
- ✅ npm or yarn installed (`npm --version`)
- ✅ MongoDB running (local or cloud)
- ✅ Git (optional)

## Step-by-Step Installation

### Step 1: Navigate to Project Directory
```bash
cd c:\Users\Vivek\Desktop\smallreactprojects\hand-cricket-game
```

### Step 2: Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (already done)
# Verify .env has these values:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/hand-cricket
# JWT_SECRET=hand_cricket_interview_secret_key_2026
# NODE_ENV=development
# CLIENT_URL=http://localhost:3000
```

### Step 3: Client Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install
```

### Step 4: Start MongoDB

**Option 1: Local MongoDB**
```bash
# On Windows (if installed as service)
# Service should auto-start

# Or start manually
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
- Update MONGODB_URI in server/.env with your connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/hand-cricket`

### Step 5: Start the Application

**Terminal 1 - Start Server (from `server` directory):**
```bash
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 2 - Start Client (from `client` directory):**
```bash
npm run dev
```

Expected output:
```
VITE v8.1.1  ready in 123 ms
➜  Local:   http://localhost:5173/
➜  Press h to show help
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Verification Checklist

- [ ] Client running on `http://localhost:5173`
- [ ] Server running on `http://localhost:5000`
- [ ] MongoDB connection successful
- [ ] Can create account (Signup page)
- [ ] Can login with created account
- [ ] Can start a game
- [ ] Can access leaderboard
- [ ] Can view profile

## Troubleshooting

### MongoDB Connection Issues

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   lsof -i :27017
   
   # Start MongoDB on Windows
   net start MongoDB
   ```

2. Check connection string in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hand-cricket
   ```

3. Use MongoDB Atlas (recommended for interviews):
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Update `.env` with connection string

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Kill process using the port:
   ```bash
   # On Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Use different port in `.env`:
   ```env
   PORT=5001
   ```

### Dependencies Installation Failed

**Problem:** `npm ERR! ...`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### CORS Errors

**Problem:** `Access to XMLHttpRequest blocked by CORS`

**Solution:** Ensure `.env` has correct CLIENT_URL:
```env
CLIENT_URL=http://localhost:3000
```

or for Vite:
```env
CLIENT_URL=http://localhost:5173
```

## Testing the Application

### 1. Create an Account
- Click "Sign Up"
- Enter name, email, password
- Click "Sign Up" button

### 2. Login
- Email: (the email you just created)
- Password: (the password you just created)
- Click "Login"

### 3. Play a Game
- Select difficulty level (Easy, Medium, Hard)
- Click "Create Game"
- Choose a hand for the toss
- Click "Play Toss"
- Choose hands and play rounds
- Click "Finish Game"

### 4. Check Stats
- Click "Profile" to view your statistics
- Click "Leaderboard" to see rankings

## Project Structure Overview

```
hand-cricket-game/
├── server/
│   ├── config/database.js          # MongoDB connection
│   ├── models/                     # User, Game, Leaderboard schemas
│   ├── routes/                     # API endpoints
│   ├── middleware/auth.js          # JWT authentication
│   ├── utils/                      # Game logic, Markov model
│   ├── server.js                   # Main server file
│   ├── .env                        # Environment variables
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── api/api.js              # API client setup
│   │   ├── components/             # React components
│   │   ├── context/AuthContext.jsx # Auth state management
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # React entry point
│   ├── vite.config.js              # Vite configuration
│   └── package.json
│
├── README.md                       # Full documentation
└── SETUP.md                        # This file
```

## Production Deployment Notes

### For AWS/Heroku:

1. **Database:** Use MongoDB Atlas for cloud hosting
2. **Environment Variables:** Set in deployment platform settings
3. **Build Commands:**
   ```bash
   # Frontend
   npm run build
   
   # Backend
   No build needed, but ensure dependencies are installed
   ```

4. **Start Command:**
   ```bash
   npm start
   ```

### Key Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=<your_atlas_connection_string>
JWT_SECRET=<strong_random_secret>
CLIENT_URL=<your_production_domain>
PORT=5000
```

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server (in server or client directory)

# Production
npm run build        # Build React app (in client directory)
npm start           # Start server with node (in server directory)

# Dependencies
npm install         # Install packages
npm update          # Update packages

# Cleaning
npm cache clean --force
rm -rf node_modules
rm package-lock.json
```

## Performance Tips

1. **Browser DevTools:** Open F12 to check network requests
2. **Network Tab:** Monitor API response times
3. **Console:** Check for errors or warnings
4. **React DevTools:** Install React extension for Chrome

## Support & Help

If you encounter issues:

1. Check the error message carefully
2. Review the SETUP.md (this file) troubleshooting section
3. Check README.md for feature documentation
4. Verify all prerequisites are installed
5. Ensure ports 3000 and 5000 are available

## Next Steps

After successful setup:

1. 📖 Read README.md for feature documentation
2. 🎮 Play some games to familiarize yourself
3. 🔍 Review the code structure
4. 🚀 Deploy to production (follow deployment notes)
5. 📝 Add more features as needed

---

**Happy Coding! 🚀**
