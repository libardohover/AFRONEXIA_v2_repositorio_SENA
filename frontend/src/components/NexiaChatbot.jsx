import React, { useState, useRef, useEffect } from 'react';
import './NexiaChatbot.css';

export default function NexiaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy NEXIA 🌺, asistente de AFRONEXIA en Barrancabermeja. ¿Qué experiencia o comida típica buscas hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input;
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/v1/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: query }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.respuesta || 'Respuesta generada.' }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error de conexión con el backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nexia-wrapper">
      {!isOpen && (
        <button className="nexia-btn-open" onClick={() => setIsOpen(true)}>
          💬 Hablar con NEXIA IA
        </button>
      )}

      {isOpen && (
        <div className="nexia-chatbox">
          <div className="nexia-chat-header">
            <div>
              <strong>NEXIA - Guía Cultural</strong>
              <small>AFRONEXIA</small>
            </div>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="nexia-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.sender}`}>{m.text}</div>
            ))}
            {loading && <div className="bubble bot typing">NEXIA está escribiendo...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="nexia-chat-footer">
            <input
              type="text"
              placeholder="Pregunta por rutas, comida, eventos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}