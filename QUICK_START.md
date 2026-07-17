# ⚡ Quick Start Guide

Get the Hand Cricket Game running in 5 minutes!

## What You Need
- Node.js installed
- MongoDB running locally OR MongoDB Atlas account

## 3-Step Startup

### Step 1: Start Server (Terminal 1)
```bash
cd server
npm run dev
```
✅ Wait for: `Server running on port 5000`

### Step 2: Start Client (Terminal 2)
```bash
cd ../client
npm run dev
```
✅ Wait for: `http://localhost:5173/`

### Step 3: Open Browser
```
http://localhost:5173
```

## First Game

1. **Sign Up**
   - Name: Your Name
   - Email: yourname@example.com
   - Password: password123
   - Click "Sign Up"

2. **Play Game**
   - Select difficulty: Easy/Medium/Hard
   - Click "Create Game"
   - Choose rock/paper/scissors for toss
   - Play rounds by selecting hands
   - Click "Finish Game"

3. **View Stats**
   - Click "Profile" to see your stats
   - Click "Leaderboard" to see rankings

## Troubleshooting

**MongoDB not connecting?**
```
# Option 1: Start MongoDB locally
mongod

# Option 2: Use MongoDB Atlas
# 1. Create account at mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Get connection string
# 4. Update server/.env with connection string
```

**Port 5000 already in use?**
```bash
# Change PORT in server/.env
PORT=5001
```

**Installation failed?**
```bash
cd server
npm cache clean --force
rm -rf node_modules
npm install
```

## Project Features

✨ **Gameplay**
- 🏏 Hand cricket game mechanics
- 🤖 AI bots with 3 difficulty levels
- 🎮 Real-time score tracking
- 📊 Stats and leaderboard

🔐 **Features**
- 👤 User authentication (JWT)
- 🏆 Leaderboard ranking
- 📈 Player statistics
- 🎯 Markov model AI

## File Structure

```
hand-cricket-game/
├── server/          # Backend (Node.js/Express)
├── client/          # Frontend (React/Vite)
├── README.md        # Full documentation
├── SETUP.md         # Detailed setup guide
└── QUICK_START.md   # This file
```

## Test Accounts

You can create your own, or use:
```
Email: test@example.com
Password: password123
```

## Key Files to Know

**Server:**
- `server/server.js` - Main server
- `server/routes/game.js` - Game API
- `server/utils/markovModel.js` - AI logic

**Client:**
- `client/src/App.jsx` - Main app
- `client/src/components/Game/` - Game interface
- `client/src/context/AuthContext.jsx` - Auth state

## Next Steps

1. 📖 Read `README.md` for detailed documentation
2. 🎮 Play a few games to understand mechanics
3. 📝 Review the code structure
4. 🚀 Deploy to production when ready

## Terminal Commands

```bash
# Start server (from server directory)
npm run dev
npm start

# Start client (from client directory)
npm run dev
npm run build

# Build for production
npm run build
```

## Important Notes

⚠️ **Before interviews:**
- Keep both terminals running
- Test all features (signup, play, leaderboard, profile)
- Have sample gameplay ready
- Know the tech stack and architecture
- Be ready to explain the code

🎯 **Interview talking points:**
- Full-stack development with modern tech
- Real-time features with Socket.IO
- Database design with MongoDB
- Authentication with JWT
- UI/UX design with React
- AI implementation with Markov models
- Production-ready code patterns

## Still Need Help?

- Read `SETUP.md` for detailed setup instructions
- Read `README.md` for complete documentation
- Check console for error messages (F12 in browser)
- Verify ports: localhost:5000 (server), localhost:5173 (client)

---

**You're all set! Have fun playing! 🚀**
