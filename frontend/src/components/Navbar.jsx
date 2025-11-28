import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧠</span>
          <span className="logo-text">AI Quiz Platform</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/upload" className="nav-link">Upload</Link>
          <Link to="/results" className="nav-link">Results</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>

        <div className="navbar-user">
          {user && (
            <span className="user-name">{user.name || user.email}</span>
          )}
          <button onClick={handleLogout} className="logout-button">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

