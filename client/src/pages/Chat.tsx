import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatList from '../components/ChatList';
import { sendMessage, fetchMessages } from '../services/messageService';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState<any[]>([]);

  const token = localStorage.getItem('token') || '';
  const userId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    let isMounted = true;
    let intervalId: number;

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

    intervalId = window.setInterval(async () => {
      try {
        const msgs = await fetchMessages(token);
        if (isMounted) {
          setAllMessages(msgs);
        }
      } catch (err) {
        console.error('Polling fetch messages error:', err);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
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
    contentWrapper: {
      display: 'flex',
      flex: 1,
      height: 'calc(100vh - 72px)', // Adjust if your Header height changes
    },
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#1e1e1e',
      borderLeft: '1px solid #333',
    },
    messageList: {
      flex: 1,
      padding: '1rem',
      overflowY: 'auto' as const,
      borderBottom: '1px solid #333',
    },
    messageItem: {
      marginBottom: '0.75rem',
      fontSize: '0.95rem',
      lineHeight: '1.4',
      color: '#ddd',
    },
    inputArea: {
      display: 'flex',
      gap: '0.5rem',
      padding: '1rem',
      backgroundColor: '#181818',
    },
    input: {
      flex: 1,
      padding: '0.6rem 1rem',
      borderRadius: '6px',
      border: '1px solid #333',
      backgroundColor: '#2a2a2a',
      color: '#f0f0f0',
      outline: 'none',
      fontSize: '1rem',
    },
    button: {
      padding: '0.6rem 1.2rem',
      backgroundColor: '#1e90ff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <Header />
      </div>
      <div style={styles.contentWrapper}>
        <ChatList />
        <div style={styles.chatArea}>
          <div style={styles.messageList}>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {allMessages.map((msg) => (
                <li key={msg.id} style={styles.messageItem}>
                  <strong style={{ color: '#1e90ff' }}>User {msg.sender_id}:</strong> {msg.content}
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.inputArea}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.button}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
