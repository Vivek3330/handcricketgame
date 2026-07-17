import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leaderboardAPI } from '../../api/api';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchStats();
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await leaderboardAPI.getUserStats();
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
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
    <div className="profile-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1>🏏 Hand Cricket</h1>
        </div>
        <div className="navbar-right">
          <button className="btn-secondary" onClick={() => navigate('/game')}>
            Play Game
          </button>
          <button className="btn-secondary" onClick={() => navigate('/leaderboard')}>
            Leaderboard
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading stats...</div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <p className="stat-label">Games Played</p>
                  <p className="stat-value">{stats.gamesPlayed}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <p className="stat-label">Games Won</p>
                  <p className="stat-value">{stats.gamesWon}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <p className="stat-label">Win Rate</p>
                  <p className="stat-value">{stats.winRate}%</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏃</div>
                <div className="stat-content">
                  <p className="stat-label">Total Runs</p>
                  <p className="stat-value">{stats.totalRuns}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <p className="stat-label">Total Wickets</p>
                  <p className="stat-value">{stats.wickets}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <p className="stat-label">Rank</p>
                  <p className="stat-value">#{stats.rank}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
