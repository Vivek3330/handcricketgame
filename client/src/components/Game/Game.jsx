import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { gameAPI } from '../../api/api';
import GameBoard from './GameBoard';
import './Game.css';

export default function Game() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCreateGame = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await gameAPI.createGame(difficulty);
      setGameState(response.data.game);
      setGameStarted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1>🏏 Hand Cricket</h1>
          <p className="welcome-text">Welcome, {user.name}!</p>
        </div>
        <div className="navbar-right">
          <button className="btn-secondary" onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </button>
          <button className="btn-secondary" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="game-content">
        {!gameStarted ? (
          <div className="game-setup">
            <h2>Start a New Game</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="difficulty-selector">
              <label>Select Difficulty Level:</label>
              <div className="difficulty-options">
                {['easy', 'medium', 'hard'].map((level) => (
                  <label key={level} className="radio-label">
                    <input
                      type="radio"
                      value={level}
                      checked={difficulty === level}
                      onChange={(e) => setDifficulty(e.target.value)}
                      disabled={loading}
                    />
                    <span className="radio-text">
                      {level === 'easy' && '🟢 Easy'}
                      {level === 'medium' && '🟡 Medium'}
                      {level === 'hard' && '🔴 Hard'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              className="btn-primary btn-large"
              onClick={handleCreateGame}
              disabled={loading}
            >
              {loading ? 'Creating Game...' : 'Create Game'}
            </button>
          </div>
        ) : (
          <GameBoard game={gameState} setGameState={setGameState} user={user} />
        )}
      </div>
    </div>
  );
}
