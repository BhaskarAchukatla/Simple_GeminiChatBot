// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;
    
    const userMessage = { role: 'user', content: message };
    setChat([...chat, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message,
      });

      const botMessage = { role: 'bot', content: response.data.reply };
      setChat([...chat, userMessage, botMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Simple Chatbot</h1>

      <div className="chat-box" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You: ' : 'Bot: '}</strong>{msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1 }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
