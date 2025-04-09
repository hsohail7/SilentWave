import React from 'react';
import Header from '../components/Header';
import SignupForm from '../components/SignupForm';

const Signup: React.FC = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <SignupForm />
      </main>
    </div>
  );
};

export default Signup;
