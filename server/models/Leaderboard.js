const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  userName: String,
  winRate: {
    type: Number,
    default: 0,
  },
  totalGames: {
    type: Number,
    default: 0,
  },
  totalWins: {
    type: Number,
    default: 0,
  },
  totalRuns: {
    type: Number,
    default: 0,
  },
  totalWickets: {
    type: Number,
    default: 0,
  },
  avgRunsPerGame: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
