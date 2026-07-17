import React, { useState } from 'react';
import { gameAPI } from '../../api/api';
import './GameBoard.css';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function GameBoard({ game, user }) {
  const [gamePhase, setGamePhase] = useState('toss');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [guess, setGuess] = useState(null);
  const [battingKey, setBattingKey] = useState(null);
  const [bowlingKey, setBowlingKey] = useState(null);
  const [currentInning, setCurrentInning] = useState(1);
  const [target, setTarget] = useState(null);
  const [scores, setScores] = useState({
    player1Runs: 0,
    player1Wickets: 0,
    player2Runs: 0,
    player2Wickets: 0,
  });
  const [lastBall, setLastBall] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inningBreak, setInningBreak] = useState(false);
  const [tossWinner, setTossWinner] = useState(null);
  const [tossMessage, setTossMessage] = useState('');

  const handleToss = async () => {
    if (!guess) {
      setError('Choose odd or even');
      return;
    }
    if (!selectedNumber) {
      setError('Choose a number (1-10)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await gameAPI.playToss(game.gameId, guess, selectedNumber);
      const data = response.data;

      setTossWinner(data.tossWinner);
      setTossMessage(data.message);

      if (data.needsChoice) {
        setGamePhase('toss-choice');
      } else {
        setBattingKey(data.batting);
        setBowlingKey(data.bowling);
        setGamePhase('ready');
      }
      setLastBall({ yourNumber: data.yourNumber, botNumber: data.botNumber, message: data.message });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to play toss');
    } finally {
      setLoading(false);
      setSelectedNumber(null);
    }
  };

  const handleChoice = async (choice) => {
    setLoading(true);
    setError('');

    try {
      const response = await gameAPI.chooseBatBowl(game.gameId, choice);
      setBattingKey(response.data.batting);
      setBowlingKey(response.data.bowling);
      setTossMessage(response.data.message);
      setGamePhase('ready');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record choice');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayBall = async () => {
    if (!selectedNumber) {
      setError('Choose a number (1-10)');
      return;
    }

    setLoading(true);
    setError('');
    const wasBatting = battingKey === 'player1';

    try {
      const response = await gameAPI.playBall(game.gameId, selectedNumber);
      const data = response.data;

      setScores({
        player1Runs: data.player1Runs,
        player1Wickets: data.player1Wickets,
        player2Runs: data.player2Runs,
        player2Wickets: data.player2Wickets,
      });
      setLastBall({
        yourNumber: data.yourNumber,
        botNumber: data.botNumber,
        outcome: data.outcome,
        wasBatting,
      });
      setTarget(data.target);

      if (data.status === 'finished') {
        setFinalResult(data.finalResult);
        setGamePhase('finished');
      } else if (data.currentInning !== currentInning) {
        setCurrentInning(data.currentInning);
        setBattingKey((prev) => (prev === 'player1' ? 'player2' : 'player1'));
        setBowlingKey((prev) => (prev === 'player1' ? 'player2' : 'player1'));
        setInningBreak(true);
        setTimeout(() => setInningBreak(false), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to play ball');
    } finally {
      setLoading(false);
      setSelectedNumber(null);
    }
  };

  const handleFinishGame = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await gameAPI.finishGame(game.gameId);
      setFinalResult(response.data);
      setGamePhase('finished');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finish game');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const youAreBatting = battingKey === 'player1';

  return (
    <div className="gameboard-container">
      <div className="scoreboard">
        <div className={`score-card ${battingKey === 'player1' ? 'is-batting' : ''}`}>
          <h3>{user.name}</h3>
          <p className="score">
            {scores.player1Runs} / {scores.player1Wickets}
          </p>
          {battingKey === 'player1' && <span className="role-badge">🏏 Batting</span>}
          {bowlingKey === 'player1' && <span className="role-badge">🎯 Bowling</span>}
        </div>

        <div className="vs-divider">VS</div>

        <div className={`score-card ${battingKey === 'player2' ? 'is-batting' : ''}`}>
          <h3>Bot ({game.player2.difficulty})</h3>
          <p className="score">
            {scores.player2Runs} / {scores.player2Wickets}
          </p>
          {battingKey === 'player2' && <span className="role-badge">🏏 Batting</span>}
          {bowlingKey === 'player2' && <span className="role-badge">🎯 Bowling</span>}
        </div>
      </div>

      {target && gamePhase === 'playing' && currentInning === 2 && (
        <div className="target-banner">
          🎯 Target: <strong>{target}</strong> runs to win
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {gamePhase === 'toss' && (
        <div className="game-phase">
          <h2>Toss Time!</h2>
          <p className="instruction">Guess odd or even for the sum of both hands, then choose your number</p>

          <div className="guess-selector">
            <button
              className={`guess-button ${guess === 'odd' ? 'selected' : ''}`}
              onClick={() => setGuess('odd')}
              disabled={loading}
            >
              Odd
            </button>
            <button
              className={`guess-button ${guess === 'even' ? 'selected' : ''}`}
              onClick={() => setGuess('even')}
              disabled={loading}
            >
              Even
            </button>
          </div>

          <div className="number-selector">
            {NUMBERS.map((n) => (
              <button
                key={n}
                className={`number-button ${selectedNumber === n ? 'selected' : ''}`}
                onClick={() => setSelectedNumber(n)}
                disabled={loading}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            className="btn-primary btn-large"
            onClick={handleToss}
            disabled={loading || !selectedNumber || !guess}
          >
            {loading ? 'Tossing...' : 'Play Toss'}
          </button>
        </div>
      )}

      {gamePhase === 'toss-choice' && (
        <div className="game-phase">
          <h2>You won the toss! 🎉</h2>
          {lastBall && (
            <p className="instruction">
              Your number: {lastBall.yourNumber} | Bot's number: {lastBall.botNumber}
            </p>
          )}
          <p className="instruction">Choose to bat or bowl first</p>
          <div className="choice-buttons">
            <button className="btn-primary btn-large" onClick={() => handleChoice('bat')} disabled={loading}>
              🏏 Bat First
            </button>
            <button className="btn-primary btn-large" onClick={() => handleChoice('bowl')} disabled={loading}>
              🎯 Bowl First
            </button>
          </div>
        </div>
      )}

      {gamePhase === 'ready' && (
        <div className="game-phase ready-phase">
          <div className={`toss-result-banner ${tossWinner === 'player1' ? 'won' : 'lost'}`}>
            {tossWinner === 'player1' ? '🎉 You won the toss!' : '😔 You lost the toss'}
          </div>
          <p className="instruction">{tossMessage}</p>
          <p className="instruction role-instruction">
            {battingKey === 'player1' ? "You're batting first 🏏" : "You're bowling first 🎯"}
          </p>
          <button
            className="btn-primary btn-large"
            onClick={() => {
              setLastBall(null);
              setGamePhase('playing');
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {gamePhase === 'playing' && (
        <div className="game-phase">
          <h2>{youAreBatting ? 'Your turn to bat' : 'Your turn to bowl'}</h2>
          <p className="instruction">
            {youAreBatting
              ? 'Pick a number - avoid matching the bowler to keep scoring!'
              : 'Pick a number - match the batsman to get them out!'}
          </p>

          {inningBreak && (
            <div className="inning-break-banner">🔄 Innings break! Roles have switched.</div>
          )}

          <div className="number-selector">
            {NUMBERS.map((n) => (
              <button
                key={n}
                className={`number-button ${selectedNumber === n ? 'selected' : ''}`}
                onClick={() => setSelectedNumber(n)}
                disabled={loading}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            className="btn-primary btn-large"
            onClick={handlePlayBall}
            disabled={loading || !selectedNumber}
          >
            {loading ? 'Playing...' : 'Play Ball'}
          </button>
          <button className="btn-secondary btn-large" onClick={handleFinishGame} disabled={loading}>
            End Game Now
          </button>

          {lastBall && (
            <div className="round-result">
              <div className="result-item">
                <p>Your Number: {lastBall.yourNumber}</p>
              </div>
              <div className="result-item">
                <p>Bot Number: {lastBall.botNumber}</p>
              </div>
              <div className="result-message">
                {lastBall.outcome === 'wicket' &&
                  (lastBall.wasBatting ? "🎯 OUT! You lost your wicket." : '🎯 WICKET! You got the bot out!')}
                {lastBall.outcome === 'runs' &&
                  (lastBall.wasBatting
                    ? `✅ You scored ${lastBall.yourNumber} run${lastBall.yourNumber === 1 ? '' : 's'}!`
                    : `You gave away ${lastBall.botNumber} run${lastBall.botNumber === 1 ? '' : 's'}.`)}
              </div>
            </div>
          )}
        </div>
      )}

      {gamePhase === 'finished' && finalResult && (
        <div className="game-phase finished">
          <h2>{finalResult.winner === 'player1' ? 'You Won! 🎉' : finalResult.winner === 'tie' ? "It's a Tie!" : 'You Lost 😞'}</h2>
          <div className="result-card">
            <p>
              Final Score: {finalResult.player1Runs} - {finalResult.player2Runs}
            </p>
            <p>Win Type: {finalResult.winType}</p>
          </div>
          <button className="btn-primary btn-large" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
