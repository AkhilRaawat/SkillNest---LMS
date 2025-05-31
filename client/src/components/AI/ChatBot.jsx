// /client/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);  // Get backend URL from environment
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  // Always use the backend URL (production)
  const apiBaseUrl = backendUrl;

  // Debug: Log the backend URL being used
  useEffect(() => {
    console.log('🔗 ChatBot using backend URL:', backendUrl);
    console.log('🔗 ChatBot API base URL:', apiBaseUrl);
    console.log('🔗 Using production backend');
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Load conversation history when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadConversationHistory();
    }
  }, [isOpen]);  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chatbot/history/${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.messages && data.data.messages.length > 0) {
        setMessages(data.data.messages);
      } else {
        // Welcome message for new conversations
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm Bobby, your AI assistant. How can I help you today? 👋",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Bobby, your AI assistant. How can I help you today? 👋",
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);    try {
      const response = await fetch(`${apiBaseUrl}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const assistantMessage = {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: error.message.includes('fetch') 
          ? "I'm having trouble connecting to the server. Please check your internet connection and try again."
          : "I'm sorry, I'm having trouble processing your request. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };  const clearConversation = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/chatbot/conversation/${sessionId}`, {
        method: 'DELETE'
      });
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Bobby, your AI assistant. How can I help you today?",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`bobby-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <div className="bobby-avatar">
            <span>🤖</span>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="bobby-chat-container">
          <div className="bobby-chat-header">
            <div className="bobby-header-info">
              <div className="bobby-avatar small">🤖</div>
              <div>
                <h4>Bobby</h4>
                <span className="bobby-status">AI Assistant</span>
              </div>
            </div>
            <button onClick={clearConversation} className="bobby-clear-btn" title="Clear conversation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6-1,14-10,0-1-14m5-6 2,0 2,0"></path>
              </svg>
            </button>
          </div>

          <div className="bobby-chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`bobby-message ${message.role}`}>
                <div className="bobby-message-content">
                  <p>{message.content}</p>
                  <span className="bobby-message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="bobby-message assistant">
                <div className="bobby-message-content">
                  <div className="bobby-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="bobby-chat-input">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Bobby anything..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;