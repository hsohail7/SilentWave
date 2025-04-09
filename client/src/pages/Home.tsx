import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <h2>Welcome to SilentWave</h2>
        <p>A secure chat application. Please sign up or login to continue.</p>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link> | <Link to="/chat">Chat</Link>
        </nav>
      </main>
    </div>
  );
};

export default Home;
