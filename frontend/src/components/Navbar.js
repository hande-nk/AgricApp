import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { user, dispatch } = useAuthContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user'); // Clear user data from localStorage
  };

  return (
    <header>
      <nav>
        <div className="container">
          {/* App Name / Logo */}
          <Link to="/">
            <h1>AgricApp</h1>
          </Link>
          {/* Navigation Links */}
          <div className="nav-links">
            {user ? (
              // If user is logged in
              <>
                {/* Display user's name */}
                <span className="user-name">Hello, {user.user.name}</span>
                {/* Link to Profile Page */}
                <Link to="/profile">User data</Link>
                {/* Logout Button */}
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              // If no user is logged in
              <>
                <Link className="signup-link" to="/signup">
                  Signup
                </Link>
                <Link className="login-link" to="/login">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
