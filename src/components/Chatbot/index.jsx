import React, { useState, useRef, useEffect } from 'react';
import portfolioData from '@data/portfolioData.json';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi! I'm ${portfolioData.personal.name}'s AI assistant. Select a question below to learn more about his background! 🤖`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [questionsExpanded, setQuestionsExpanded] = useState(true);
  const [currentSet, setCurrentSet] = useState('general');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get question sets from JSON data
  const questionSets = portfolioData.chatbot;

  const handleQuestionClick = (qa) => {
    const userMessage = {
      id: messages.length + 1,
      text: qa.question,
      sender: 'user',
      timestamp: new Date()
    };

    const botResponse = {
      id: messages.length + 2,
      text: qa.answer,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setQuestionsExpanded(false); // Collapse questions to show answer
    setShowQuestions(true); // Keep questions available but collapsed
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: `Hi! I'm ${portfolioData.personal.name}'s AI assistant. Select a question below to learn more about his background! 🤖`,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setShowQuestions(true);
    setQuestionsExpanded(true);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="bot-info">
              <div className="bot-avatar">🤖</div>
              <div>
                <h4>{portfolioData.personal.name}'s AI Assistant</h4>
                <span className="status">Online</span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="reset-btn"
                onClick={resetChat}
                aria-label="Reset chat"
                title="Reset chat"
              >
                🔄
              </button>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  {message.text.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Question Categories */}
          {showQuestions && (
            <div className="quick-questions">
              <div className="questions-header" onClick={() => setQuestionsExpanded(!questionsExpanded)}>
                <p>Ask me about {portfolioData.personal.name}:</p>
                <button className="expand-btn" aria-label="Toggle questions">
                  {questionsExpanded ? '▼' : '▶'}
                </button>
              </div>
              
              {questionsExpanded && (
                <div className="questions-content">
                  <div className="question-tabs">
                    <button 
                      className={`tab-btn ${currentSet === 'general' ? 'active' : ''}`}
                      onClick={() => setCurrentSet('general')}
                    >
                      General
                    </button>
                    <button 
                      className={`tab-btn ${currentSet === 'technical' ? 'active' : ''}`}
                      onClick={() => setCurrentSet('technical')}
                    >
                      Technical
                    </button>
                    <button 
                      className={`tab-btn ${currentSet === 'career' ? 'active' : ''}`}
                      onClick={() => setCurrentSet('career')}
                    >
                      Career
                    </button>
                  </div>
                  <div className="questions-grid">
                    {questionSets[currentSet].map((qa) => (
                      <button
                        key={qa.id}
                        className="quick-question-btn"
                        onClick={() => handleQuestionClick(qa)}
                      >
                        {qa.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Disabled Input Area for Visual Reference */}
          <div className="chatbot-input disabled">
            <input
              type="text"
              placeholder="Select a question above to chat..."
              disabled={true}
            />
            <button 
              disabled={true}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
