import React from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    formWrapper: {
      backgroundColor: '#1e1e1e',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      width: '100%',
      maxWidth: '500px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <Header />
      </div>
      <main style={styles.main}>
        <div style={styles.formWrapper}>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
