import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/dashboard" className="navbar__logo">TJ</Link>
        <Link to="/dashboard" className="navbar__link">Dashboard</Link>
      </div>

      <div className="navbar__right">
        <Link to="/profile" className="navbar__user">
          <div className="navbar__avatar">
            {user?.email?.[0].toUpperCase()}
          </div>
          <span className="navbar__email">{user?.email}</span>
        </Link>
        <button className="navbar__logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
