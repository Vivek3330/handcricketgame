const express = require('express');
const auth = require('../middleware/auth');
const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

const router = express.Router();

router.get('/top', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const leaderboard = await Leaderboard.find()
      .sort({ winRate: -1, totalWins: -1 })
      .limit(parseInt(limit));

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1,
    }));

    res.json({ leaderboard: rankedLeaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  try {
    const leaderboardEntry = await Leaderboard.findOne({ userId: req.params.userId });

    if (!leaderboardEntry) {
      return res.status(404).json({ message: 'User not found in leaderboard' });
    }

    const rank = await Leaderboard.countDocuments({
      winRate: { $gt: leaderboardEntry.winRate },
    });

    res.json({
      leaderboard: {
        ...leaderboardEntry.toObject(),
        rank: rank + 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const leaderboardEntry = await Leaderboard.findOne({ userId: req.userId });
    const rank = leaderboardEntry
      ? await Leaderboard.countDocuments({
          winRate: { $gt: leaderboardEntry.winRate },
        }) + 1
      : 0;

    res.json({
      stats: {
        ...user.stats,
        rank,
        winRate: user.stats.gamesPlayed > 0
          ? ((user.stats.gamesWon / user.stats.gamesPlayed) * 100).toFixed(2)
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
