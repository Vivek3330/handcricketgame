const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  player1: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: String,
    lastNumber: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    numberHistory: {
      type: [Number],
      default: [],
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
  },
  player2: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    lastNumber: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    runs: {
      type: Number,
      default: 0,
    },
    wickets: {
      type: Number,
      default: 0,
    },
    isBot: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: String,
    enum: ['waiting', 'toss', 'toss-choice', 'inning1', 'inning2', 'finished'],
    default: 'waiting',
  },
  currentInning: {
    type: Number,
    default: 1,
  },
  target: {
    type: Number,
    default: null,
  },
  tossWinner: String,
  batting: String,
  bowling: String,
  winner: String,
  winType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Game', gameSchema);
