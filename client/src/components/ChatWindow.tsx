import React from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow: React.FC = () => {
  return (
    <div style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', overflowY: 'auto' }}>
      <MessageBubble message="Example from ChatWindow. Real messages show in Chat.tsx." />
    </div>
  );
};

export default ChatWindow;
