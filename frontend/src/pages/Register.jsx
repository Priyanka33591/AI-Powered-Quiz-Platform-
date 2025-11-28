import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { register as registerAPI } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await registerAPI(name, email, password);
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
      
      <div className="register-wrapper">
        {/* Left Side - Illustration */}
        <div className="register-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">🎓</div>
            <h2 className="illustration-title">Join Us Today!</h2>
            <p className="illustration-text">
              Start creating amazing quizzes with AI-powered features
            </p>
            <div className="illustration-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">✨</span>
                <div className="benefit-content">
                  <h4>AI Powered</h4>
                  <p>Generate quizzes automatically</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📊</span>
                <div className="benefit-content">
                  <h4>Analytics</h4>
                  <p>Track your progress</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🚀</span>
                <div className="benefit-content">
                  <h4>Fast Setup</h4>
                  <p>Get started in minutes</p>
                </div>
              </div>
            </div>
            <div className="floating-elements">
              <div className="float-element float-1">📚</div>
              <div className="float-element float-2">💡</div>
              <div className="float-element float-3">⭐</div>
              <div className="float-element float-4">🎯</div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="register-form-section">
          <div className="register-card">
            <div className="register-header">
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="label-icon">🔐</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="register-footer">
              <p className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
              <div className="divider">
                <span>or</span>
              </div>
              <Link to="/" className="back-home-link">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
