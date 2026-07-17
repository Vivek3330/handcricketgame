import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { leaderboardAPI } from '../../api/api';
import './Leaderboard.css';

export default function Leaderboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchLeaderboard();
    }
  }, [user, navigate]);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getTop(20);
      setLeaderboard(response.data.leaderboard);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leaderboard');
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
    <div className="leaderboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1>🏏 Hand Cricket</h1>
        </div>
        <div className="navbar-right">
          <button className="btn-secondary" onClick={() => navigate('/game')}>
            Play Game
          </button>
          <button className="btn-secondary" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="leaderboard-content">
        <h2>🏆 Leaderboard</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading leaderboard...</div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Games</th>
                  <th>Wins</th>
                  <th>Win Rate</th>
                  <th>Runs</th>
                  <th>Wickets</th>
                  <th>Avg Runs</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry._id} className={entry.userId === user.id ? 'highlight-row' : ''}>
                    <td className="rank">
                      {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : index + 1}
                    </td>
                    <td className="player-name">{entry.userName}</td>
                    <td>{entry.totalGames}</td>
                    <td>{entry.totalWins}</td>
                    <td className="win-rate">{entry.winRate}%</td>
                    <td>{entry.totalRuns}</td>
                    <td>{entry.totalWickets}</td>
                    <td>{entry.avgRunsPerGame || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
