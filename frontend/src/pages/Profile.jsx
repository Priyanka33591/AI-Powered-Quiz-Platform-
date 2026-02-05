import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getQuizHistoryAndStats } from '../api/quiz';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    averageScore: 0,
    bestScore: 0,
  });
  const [history, setHistory] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      setStatsLoading(true);
      setStatsError('');
      try {
        const data = await getQuizHistoryAndStats();
        setStats(data.stats);
        setHistory(data.history || []);
      } catch (err) {
        setStatsError(err.response?.data?.error || 'Failed to load stats');
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Simulate API call - in real app, this would update the backend
    setTimeout(() => {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate API call - in real app, this would update the backend
    setTimeout(() => {
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordSection(false);
      setLoading(false);
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statsDisplay = [
    { label: 'Total Quizzes', value: String(stats.totalQuizzes), icon: '📝', color: '#667eea' },
    { label: 'Completed', value: String(stats.totalQuizzes), icon: '✅', color: '#48bb78' },
    { label: 'Average Score', value: `${stats.averageScore}%`, icon: '📊', color: '#ed8936' },
    { label: 'Best Score', value: `${stats.bestScore}%`, icon: '🏆', color: '#f56565' },
  ];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="avatar-circle">
                  <span className="avatar-initials">{getInitials(user?.name)}</span>
                </div>
                <div className="avatar-decoration">👤</div>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user?.name || 'User'}</h2>
                <p className="profile-email">{user?.email || 'user@example.com'}</p>
                <div className="profile-badge">
                  <span className="badge-icon">⭐</span>
                  <span>Active Member</span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user?.name || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user?.email || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">Recently joined</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: user?.name || '', email: user?.email || '' });
                      setError('');
                      setSuccess('');
                    }}
                    className="btn-cancel"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {!isEditing && (
              <div className="profile-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-edit"
                >
                  <span className="btn-icon">✏️</span>
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="btn-password"
                >
                  <span className="btn-icon">🔒</span>
                  Change Password
                </button>
              </div>
            )}
          </div>

          {/* Statistics Card */}
          <div className="stats-card">
            <h3 className="card-title">
              <span className="title-icon">📊</span>
              Your Statistics
            </h3>
            {statsLoading ? (
              <div className="stats-loading">
                <LoadingSpinner />
                <span>Loading stats...</span>
              </div>
            ) : statsError ? (
              <div className="stats-error">{statsError}</div>
            ) : (
              <div className="stats-grid">
                {statsDisplay.map((stat, index) => (
                  <div key={index} className="stat-item" style={{ '--stat-color': stat.color }}>
                    <div className="stat-icon-wrapper">
                      <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)` }}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz History */}
          <div className="history-card">
            <h3 className="card-title">
              <span className="title-icon">📜</span>
              Quiz History
            </h3>
            {statsLoading ? (
              <div className="history-loading">
                <LoadingSpinner />
                <span>Loading history...</span>
              </div>
            ) : statsError ? (
              <div className="history-error">{statsError}</div>
            ) : history.length === 0 ? (
              <p className="history-empty">No quiz attempts yet. Take a quiz from the dashboard to see your history here.</p>
            ) : (
              <ul className="history-list">
                {history.map((item) => (
                  <li key={item._id} className="history-item">
                    <div className="history-item-main">
                      <span className="history-title">{item.quizTitle}</span>
                      <span className="history-score">{item.score}%</span>
                    </div>
                    <div className="history-item-meta">
                      {item.correctCount}/{item.totalQuestions} correct · {formatDate(item.createdAt)}
                    </div>
                    <Link to={{ pathname: '/results', search: `?resultId=${item._id}` }} className="history-link">View details</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Change Password Section */}
          {showPasswordSection && (
            <div className="password-card">
              <h3 className="card-title">
                <span className="title-icon">🔒</span>
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="password-form">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setError('');
                      setSuccess('');
                    }}
                    className="btn-cancel"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Settings Card
          <div className="settings-card">
            <h3 className="card-title">
              <span className="title-icon">⚙️</span>
              Account Settings
            </h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Email Notifications</span>
                  <span className="setting-desc">Receive email updates about your quizzes</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Quiz Reminders</span>
                  <span className="setting-desc">Get reminders for incomplete quizzes</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Public Profile</span>
                  <span className="setting-desc">Allow others to see your quiz results</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
