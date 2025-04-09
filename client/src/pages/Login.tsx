import React from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
