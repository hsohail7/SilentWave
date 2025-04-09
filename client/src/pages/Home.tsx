import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Home: React.FC = () => {
  const styles = {
    container: {
      backgroundColor: '#121212',
      color: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    headerWrapper: {
      backgroundColor: '#1e1e1e',
      padding: '1rem 2rem',
      borderBottom: '1px solid #333',
      color: '#121212',
    },
    main: {
      flex: 1,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
    },
    heading: {
      fontSize: '2.2rem',
      marginBottom: '1rem',
    },
    paragraph: {
      fontSize: '1.1rem',
      marginBottom: '2rem',
      color: '#cccccc',
    },
    nav: {
      display: 'flex',
      gap: '2rem',
    },
    link: {
      color: '#1e90ff',
      textDecoration: 'none',
      fontWeight: '600' as const,
      fontSize: '1.05rem',
      transition: 'color 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <Header />
      </div>
      <main style={styles.main}>
        <h2 style={styles.heading}>Welcome to SilentWave</h2>
        <p style={styles.paragraph}>
          A secure chat application. Please sign up or login to continue.
        </p>
        <nav style={styles.nav}>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/signup" style={styles.link}>Sign Up</Link>
          <Link to="/chat" style={styles.link}>Chat</Link>
        </nav>
      </main>
    </div>
  );
};

export default Home;
