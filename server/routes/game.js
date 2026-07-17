const express = require('express');
const auth = require('../middleware/auth');
const Game = require('../models/Game');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const GameLogic = require('../utils/gameLogic');
const MarkovModel = require('../utils/markovModel');

const router = express.Router();

async function finalizeGame(game) {
  const player1Runs = game.player1.runs;
  const player2Runs = game.player2.runs;

  let winner = 'tie';
  let winType = 'tie';

  if (player1Runs !== player2Runs) {
    winner = player1Runs > player2Runs ? 'player1' : 'player2';
    const chasingKey = game.currentInning === 2 ? game.batting : null;
    winType = winner === chasingKey ? 'chase' : 'defend';
  }

  game.winner = winner;
  game.winType = winType;
  game.status = 'finished';
  await game.save();

  const user = await User.findById(game.player1.userId);
  if (user) {
    user.stats.gamesPlayed += 1;
    if (winner === 'player1') {
      user.stats.gamesWon += 1;
    }
    user.stats.totalRuns += player1Runs;
    user.stats.wickets += game.player2.wickets;
    await user.save();

    await Leaderboard.findOneAndUpdate(
      { userId: user._id },
      {
        userName: user.name,
        totalGames: user.stats.gamesPlayed,
        totalWins: user.stats.gamesWon,
        totalRuns: user.stats.totalRuns,
        totalWickets: user.stats.wickets,
        winRate: GameLogic.calculateWinRate(user.stats.gamesWon, user.stats.gamesPlayed),
        avgRunsPerGame: (user.stats.totalRuns / user.stats.gamesPlayed).toFixed(2),
      },
      { upsert: true, new: true }
    );
  }

  return { winner, winType, player1Runs, player2Runs };
}

router.post('/create', auth, async (req, res) => {
  try {
    const { difficulty } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const gameId = GameLogic.generateGameId();
    const gameData = {
      gameId,
      player1: {
        userId: user._id,
        name: user.name,
      },
      player2: {
        name: 'Bot',
        difficulty: difficulty || 'medium',
        isBot: true,
      },
      status: 'toss',
    };

    const game = new Game(gameData);
    await game.save();

    res.status(201).json({
      message: 'Game created successfully',
      game: gameData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/toss', auth, async (req, res) => {
  try {
    const { gameId, guess, number } = req.body;

    if (!['odd', 'even'].includes(guess)) {
      return res.status(400).json({ message: 'Guess must be odd or even' });
    }
    if (!GameLogic.isValidNumber(number)) {
      return res.status(400).json({ message: 'Number must be between 1 and 10' });
    }

    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const markov = new MarkovModel(game.player2.difficulty);
    const botNumber = markov.getRandomNumber();

    const tossResult = GameLogic.resolveToss(guess, number, botNumber);
    game.tossWinner = tossResult.winner;

    if (tossResult.winner === 'player1') {
      game.status = 'toss-choice';
      await game.save();

      return res.json({
        message: 'You won the toss! Choose to bat or bowl',
        tossWinner: 'player1',
        needsChoice: true,
        yourNumber: number,
        botNumber,
        sum: tossResult.sum,
        parity: tossResult.parity,
      });
    }

    const botChoosesBat = Math.random() < 0.5;
    game.batting = botChoosesBat ? 'player2' : 'player1';
    game.bowling = botChoosesBat ? 'player1' : 'player2';
    game.status = 'inning1';
    await game.save();

    res.json({
      message: `Bot won the toss and chose to ${botChoosesBat ? 'bat' : 'bowl'}`,
      tossWinner: 'player2',
      needsChoice: false,
      yourNumber: number,
      botNumber,
      sum: tossResult.sum,
      parity: tossResult.parity,
      batting: game.batting,
      bowling: game.bowling,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/choose', auth, async (req, res) => {
  try {
    const { gameId, choice } = req.body;

    if (!['bat', 'bowl'].includes(choice)) {
      return res.status(400).json({ message: 'Choice must be bat or bowl' });
    }

    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    if (game.status !== 'toss-choice' || game.tossWinner !== 'player1') {
      return res.status(400).json({ message: 'No pending toss choice for this game' });
    }

    game.batting = choice === 'bat' ? 'player1' : 'player2';
    game.bowling = choice === 'bat' ? 'player2' : 'player1';
    game.status = 'inning1';
    await game.save();

    res.json({
      message: `You chose to ${choice} first`,
      batting: game.batting,
      bowling: game.bowling,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/play', auth, async (req, res) => {
  try {
    const { gameId, number } = req.body;

    if (!GameLogic.isValidNumber(number)) {
      return res.status(400).json({ message: 'Number must be between 1 and 10' });
    }

    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    if (game.status !== 'inning1' && game.status !== 'inning2') {
      return res.status(400).json({ message: 'Game is not in a playable state' });
    }

    const markov = new MarkovModel(game.player2.difficulty);
    const botRole = game.batting === 'player2' ? 'bat' : 'bowl';
    const botNumber = markov.chooseBotNumber(game.player1.numberHistory, botRole);

    game.player1.lastNumber = number;
    game.player1.numberHistory.push(number);
    game.player2.lastNumber = botNumber;

    const battingKey = game.batting;
    const bowlingKey = game.bowling;
    const battingNumber = battingKey === 'player1' ? number : botNumber;
    const bowlingNumber = bowlingKey === 'player1' ? number : botNumber;

    const ball = GameLogic.playBall(battingNumber, bowlingNumber);

    if (ball.outcome === 'wicket') {
      game[battingKey].wickets += 1;
    } else {
      game[battingKey].runs += ball.runs;
    }

    let finalResult = null;
    const battingAllOut = game[battingKey].wickets >= 6;

    if (game.currentInning === 1) {
      if (battingAllOut) {
        game.batting = bowlingKey;
        game.bowling = battingKey;
        game.currentInning = 2;
        game.target = game[battingKey].runs + 1;
        game.status = 'inning2';
      }
      await game.save();
    } else {
      const targetReached = game[battingKey].runs >= game.target;
      if (battingAllOut || targetReached) {
        finalResult = await finalizeGame(game);
      } else {
        await game.save();
      }
    }

    res.json({
      message: 'Ball played',
      outcome: ball.outcome,
      yourNumber: number,
      botNumber,
      battingKey,
      bowlingKey,
      player1Runs: game.player1.runs,
      player1Wickets: game.player1.wickets,
      player2Runs: game.player2.runs,
      player2Wickets: game.player2.wickets,
      currentInning: game.currentInning,
      target: game.target,
      status: game.status,
      finalResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/finish', auth, async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    if (game.status === 'finished') {
      return res.json({
        message: 'Game already finished',
        winner: game.winner,
        winType: game.winType,
        player1Runs: game.player1.runs,
        player2Runs: game.player2.runs,
      });
    }

    const result = await finalizeGame(game);
    res.json({ message: 'Game finished', ...result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:gameId', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId })
      .populate('player1.userId', 'name email')
      .populate('player2.userId', 'name email');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ game });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
