import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { IconMail, IconLock, IconEye } from './icons';
import './Auth.css';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(Boolean(location.state?.justSignedUp));
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/game');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />
      <div className="auth-blob blob-3" />

      <div className="auth-shell">
        <div className="auth-brand">
          <div className="brand-glow" />
          <div className="brand-emoji">🏏</div>
          <h1 className="brand-title">Hand Cricket</h1>
          <p className="brand-tagline">Toss. Bat. Bowl. Win.</p>

          <ul className="brand-features">
            <li>
              <span className="feature-dot" />
              Play against a smart AI bot
            </li>
            <li>
              <span className="feature-dot" />
              Track your stats &amp; runs
            </li>
            <li>
              <span className="feature-dot" />
              Climb the global leaderboard
            </li>
          </ul>
        </div>

        <div className="auth-form-panel">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Log in to continue your innings</p>
          </div>

          {justSignedUp && (
            <div className="success-message">
              <span>✓</span> Account created! Please login to continue.
            </div>
          )}

          {error && (
            <div className="error-message">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <span className="input-icon">
                <IconMail />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setJustSignedUp(false);
                }}
                required
                disabled={loading}
              />
              <label htmlFor="login-email">Email</label>
            </div>

            <div className="input-group">
              <span className="input-icon">
                <IconLock />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <IconEye off={showPassword} />
              </button>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Login <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <p className="switch-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
