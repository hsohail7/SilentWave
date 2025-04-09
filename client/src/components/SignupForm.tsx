import React, { useState } from 'react';
import { signup } from '../services/authService';

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signup(username, email, password);
      setMessage(`Signup success! Welcome, ${data.username}`);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <p style={{ color: 'red' }}>{message}</p>
      <input
        type="text"
        placeholder="Username"
        required
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
