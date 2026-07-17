require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user-join', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('user-online', { userId, count: connectedUsers.size });
  });

  socket.on('game-update', (gameData) => {
    io.emit('game-state', gameData);
  });

  socket.on('leaderboard-update', (leaderboardData) => {
    io.emit('leaderboard-updated', leaderboardData);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers.forEach((value, key) => {
      if (value === socket.id) {
        connectedUsers.delete(key);
      }
    });
    io.emit('user-offline', { count: connectedUsers.size });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
