import React, { useState } from 'react';
import { login } from '../services/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // store token + userId
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      setMessage(`Login success! Welcome, ${data.username}`);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <p style={{ color: 'red' }}>{message}</p>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
