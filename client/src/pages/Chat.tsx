// src/pages/Chat.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatList from '../components/ChatList';
import { sendMessage, fetchMessages } from '../services/messageService';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const token = localStorage.getItem('token') || '';
  const userId = parseInt(localStorage.getItem('userId') || '0');

  // 1) On mount, load messages once
  // 2) Then set up an interval to poll for new messages every 2 seconds
  useEffect(() => {
    let isMounted = true;
    let intervalId: number; // Explicitly type as `number`

    (async () => {
      try {
        const msgs = await fetchMessages(token);
        if (isMounted) {
          setAllMessages(msgs);
        }
      } catch (err) {
        console.error('Initial fetch messages error:', err);
      }
    })();

    // Poll every 2 seconds
    intervalId = window.setInterval(async () => { // Use `window.setInterval()` to return a number
      try {
        const msgs = await fetchMessages(token);
        if (isMounted) {
          setAllMessages(msgs);
        }
      } catch (err) {
        console.error('Polling fetch messages error:', err);
      }
    }, 2000);

    // Cleanup on unmount: stop polling
    return () => {
      isMounted = false;
      clearInterval(intervalId); // No type error now
    };
  }, [token]);

  const handleSend = async () => {
    try {
      const newMsg = await sendMessage(token, userId, message);
      setAllMessages(prev => [...prev, newMsg]);
      setMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', height: '80vh' }}>
        <ChatList />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {allMessages.map((msg) => (
                <li key={msg.id} style={{ marginBottom: '0.5rem' }}>
                  <strong>User {msg.sender_id}:</strong> {msg.content}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '1rem' }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
