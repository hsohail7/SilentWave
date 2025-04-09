import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getCurrentUser } from '../services/userService';

const Profile: React.FC = () => {
  const [info, setInfo] = useState<any>({});
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await getCurrentUser(token);
        setInfo(data);
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, []);

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
    },
    profileCard: {
      backgroundColor: '#1e1e1e',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      width: '100%',
      maxWidth: '500px',
    },
    heading: {
      fontSize: '1.8rem',
      marginBottom: '1.5rem',
      color: '#ffffff',
    },
    text: {
      marginBottom: '0.8rem',
      fontSize: '1rem',
      color: '#dddddd',
    },
    error: {
      color: '#ff4c4c',
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <Header />
      </div>
      <main style={styles.main}>
        <div style={styles.profileCard}>
          <h2 style={styles.heading}>Profile</h2>
          {error && <p style={styles.error}>{error}</p>}
          <p style={styles.text}>User ID: {info.userId}</p>
          <p style={styles.text}>Username: {info.username}</p>
          <p style={styles.text}>Email: {info.email}</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
