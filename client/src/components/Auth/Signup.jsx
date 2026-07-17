import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { IconMail, IconLock, IconUser, IconEye } from './icons';
import './Auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password, confirmPassword);
      navigate('/login', { state: { justSignedUp: true, email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
            <h2>Create your account</h2>
            <p>Join the game in seconds</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <span className="input-icon">
                <IconUser />
              </span>
              <input
                id="signup-name"
                type="text"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="signup-name">Full Name</label>
            </div>

            <div className="input-group">
              <span className="input-icon">
                <IconMail />
              </span>
              <input
                id="signup-email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="signup-email">Email</label>
            </div>

            <div className="input-group">
              <span className="input-icon">
                <IconLock />
              </span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <label htmlFor="signup-password">Password</label>
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

            <div className="input-group">
              <span className="input-icon">
                <IconLock />
              </span>
              <input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <label htmlFor="signup-confirm">Confirm Password</label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  Sign Up <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <p className="switch-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
