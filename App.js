import React, { useEffect, useRef, useState } from 'react';
import './App.css'; 

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001'); 

    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, { text: event.data, from: 'other' }]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setMessages(prev => [...prev, { text: input, from: 'me' }]);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <h2>React Chat App</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
