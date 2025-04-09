import React from 'react';

interface MessageBubbleProps {
  message: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: '#eee', borderRadius: '4px' }}>
      {message}
    </div>
  );
};

export default MessageBubble;
