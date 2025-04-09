import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // navigate to home
    navigate('/');
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
      <h1>SilentWave</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/chat">Chat</Link> | <Link to="/profile">Profile</Link>
        {token ? (
          <>
            {' '}| <button onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;
