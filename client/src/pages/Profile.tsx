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
        setInfo(data); // { userId, username, email, etc. }
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>
        <h2>Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>User ID: {info.userId}</p>
        <p>Username: {info.username}</p>
        <p>Email: {info.email}</p>
      </main>
    </div>
  );
};

export default Profile;
