import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getQuizHistoryAndStats } from '../api/quiz';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    averageScore: 0,
    bestScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const data = await getQuizHistoryAndStats();
        setStatsData(data.stats);
        setRecentActivity((data.history || []).slice(0, 8));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const stats = [
    { 
      label: 'Quizzes Taken', 
      value: String(statsData.totalQuizzes), 
      icon: '📝', 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: '📚'
    },
    { 
      label: 'Average Score', 
      value: `${statsData.averageScore}%`, 
      icon: '📊', 
      color: '#48bb78',
      gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      image: '📈'
    },
    { 
      label: 'Total Questions', 
      value: String(statsData.totalQuestions), 
      icon: '❓', 
      color: '#ed8936',
      gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      image: '💡'
    },
    { 
      label: 'Best Score', 
      value: `${statsData.bestScore}%`, 
      icon: '🏆', 
      color: '#f56565',
      gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
      image: '⭐'
    },
  ];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  };

  const quickActions = [
    { 
      title: 'Create New Quiz', 
      description: 'Upload and create a new quiz', 
      icon: '➕', 
      link: '/upload', 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgImage: '✨'
    },
    { 
      title: 'View Results', 
      description: 'Check your quiz results and performance', 
      icon: '📈', 
      link: '/results', 
      color: '#48bb78',
      gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      bgImage: '📊'
    },
    { 
      title: 'My Profile', 
      description: 'Manage your account settings', 
      icon: '👤', 
      link: '/profile', 
      color: '#ed8936',
      gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      bgImage: '⚙️'
    },
  ];

  const handleActionClick = (link) => {
    navigate(link);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-illustration">
              <div className="illustration-circle circle-1"></div>
              <div className="illustration-circle circle-2"></div>
              <div className="illustration-circle circle-3"></div>
              <div className="welcome-icon">🎓</div>
            </div>
            <div className="header-text">
              <h1 className="dashboard-title">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="dashboard-subtitle">
                Ready to test your knowledge? Let's get started!
              </p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {loading ? (
            <div className="dashboard-stats-loading">
              <LoadingSpinner />
              <span>Loading quiz analysis...</span>
            </div>
          ) : error ? (
            <div className="dashboard-stats-error">{error}</div>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ '--stat-gradient': stat.gradient }}>
                <div className="stat-card-bg"></div>
                <div className="stat-icon-wrapper">
                  <div className="stat-icon" style={{ background: stat.gradient }}>
                    <span className="stat-emoji">{stat.icon}</span>
                  </div>
                  <div className="stat-decoration">{stat.image}</div>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                onClick={() => handleActionClick(action.link)} 
                className="action-card" 
                style={{ '--card-color': action.color, '--card-gradient': action.gradient }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleActionClick(action.link);
                  }
                }}
              >
                <div className="action-bg-decoration">{action.bgImage}</div>
                <div className="action-icon" style={{ background: action.gradient }}>
                  <span className="action-icon-emoji">{action.icon}</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <div className="section-decoration">📋</div>
          </div>
          <div className="activity-card">
            {loading ? (
              <div className="activity-loading">
                <LoadingSpinner />
                <span>Loading activity...</span>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="activity-empty">
                <div className="activity-illustration">
                  <div className="activity-circle"></div>
                  <span className="activity-icon">📋</span>
                </div>
                <p className="activity-text">No recent activity yet</p>
                <p className="activity-hint">Start by taking or creating a quiz!</p>
              </div>
            ) : (
              <ul className="activity-list">
                {recentActivity.map((item) => (
                  <li key={item._id} className="activity-item">
                    <div className="activity-item-icon">📝</div>
                    <div className="activity-item-content">
                      <span className="activity-item-title">{item.quizTitle}</span>
                      <span className="activity-item-meta">
                        {item.score}% · {item.correctCount}/{item.totalQuestions} correct · {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <Link to={{ pathname: '/results', search: `?resultId=${item._id}` }} className="activity-item-link">View</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

