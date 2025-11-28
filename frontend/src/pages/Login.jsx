import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as loginAPI } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await loginAPI(email, password);
      login(response.token, response.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
      
      <div className="login-wrapper">
        {/* Left Side - Illustration */}
        <div className="login-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">🧠</div>
            <h2 className="illustration-title">Welcome Back!</h2>
            <p className="illustration-text">
              Continue your learning journey with AI-powered quizzes
            </p>
            <div className="illustration-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Fast & Secure</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>AI Powered</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track Progress</span>
              </div>
            </div>
            <div className="floating-elements">
              <div className="float-element float-1">📝</div>
              <div className="float-element float-2">❓</div>
              <div className="float-element float-3">✅</div>
              <div className="float-element float-4">🏆</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Login</h1>
              <p className="login-subtitle">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}
              
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
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
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

export default Login;
