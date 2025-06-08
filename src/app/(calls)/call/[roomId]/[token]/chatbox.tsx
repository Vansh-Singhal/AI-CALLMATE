'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ sender: 'user' | 'bot'; message: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setChat([...chat, { sender: 'user', message: input }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai', { prompt: input });
      const reply = res.data.text || 'No response received.';

      setChat(prev => [...prev, { sender: 'bot', message: reply }]);
    } catch (err) {
      setChat(prev => [...prev, { sender: 'bot', message: 'Error fetching response.' }]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="bg-white shadow-md rounded-md p-4 h-96 overflow-y-auto border">
        {chat.map((c, idx) => (
          <div
            key={idx}
            className={`my-2 p-2 rounded-md max-w-xs ${
              c.sender === 'user'
                ? 'bg-blue-100 text-right ml-auto'
                : 'bg-gray-100 text-left mr-auto'
            }`}
          >
            {c.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded-md"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
