import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader , Loader2 } from 'lucide-react';

const API_URL = 'https://api.7anish.com/api';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [convKey, setConvKey] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation key from localStorage
  useEffect(() => {
    const savedConvKey = localStorage.getItem('chatConvKey');
    if (savedConvKey) {
      setConvKey(savedConvKey);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setError(null);

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Show loading state
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          convKey: convKey
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save conversation key
        if (data.data.convKey && !convKey) {
          setConvKey(data.data.convKey);
          localStorage.setItem('chatConvKey', data.data.convKey);
        }

        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          text: data.data.message,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Initial centered view (before any messages)
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center 3 h-full bg-[#212121] text-white px-4">
        <div className="max-w-3xl w-full space-y-8">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-12">
            What do you want to know about Anish ?
          </h1>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Anish..."
                disabled={isLoading}
                className="w-full bg-[#2f2f2f] text-white text-base rounded-full px-6 py-3 pr-14 focus:outline-none focus:ring-1 focus:ring-white/50 placeholder-gray-500 transition-all duration-200 disabled:opacity-50"
                autoFocus
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-800 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 text-gray-800" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Chat view (after first message) - Following About page style
  return (
    <div className="flex flex-col h-full bg-[#212121] text-white">
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-8">
            {messages.map((msg, index) => (
              <div key={msg.id}>
                {/* User Message */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end mb-8">
                    <div className="max-w-[80%] bg-[#2f2f2f] rounded-2xl px-5 py-3 shadow-lg">
                      <p className="text-base text-white whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Message */}
                {msg.sender === 'ai' && (
                  <div className="flex justify-start mb-8">
                    <div className="max-w-[90%] space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className={`text-base leading-relaxed whitespace-pre-wrap break-words ${
                            msg.isError ? 'text-red-300' : 'text-gray-300'
                          }`}>
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-start mb-8">
                <div className="max-w-[80%]  rounded-2xl px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Loader  className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-400">Thinking....</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 sm:px-6 py-2 bg-red-900/20 border-t border-red-700/50">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* Fixed Input Area at Bottom */}
      <div className="bg-[#212121]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Anish..."
                disabled={isLoading}
                className="w-full bg-[#2f2f2f] text-white text-base rounded-full px-6 py-4 pr-14 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-800 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 text-gray-800" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
