import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your AI Career Coach. 🚀 I can help you with personalized career roadmaps, real-time market trends, course recommendations, or resume feedback. What would you like to explore?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputVal('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat/message', {
        message: text,
        history: newMessages
      });
      setMessages([...newMessages, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the backend. Please ensure the server is running.' }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Web Dev Roadmap",
    "Trending Tech Jobs",
    "Recommend Courses",
    "Improve my Resume"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{ height: '700px' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/80 to-purple-700/80 p-5 px-8 flex justify-between items-center border-b border-white/10 shrink-0">
        <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-xl mr-4">
                <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">AI Career Coach</h2>
                <div className="flex items-center text-indigo-200 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span> Online
                </div>
            </div>
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="flex gap-3 p-4 bg-white/5 overflow-x-auto whitespace-nowrap shrink-0 custom-scrollbar border-b border-white/5">
        {suggestions.map((sug, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(sug)}
            className="flex items-center px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium hover:bg-indigo-500/30 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" /> {sug}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center -mb-2 z-10 
                    ${msg.sender === 'user' ? 'bg-indigo-500 ml-2' : 'bg-purple-500 mr-2'}`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>

                <div className={`px-5 py-3 shadow-lg 
                  ${msg.sender === 'user' 
                    ? 'bg-indigo-500 text-white rounded-2xl rounded-br-none' 
                    : 'bg-white/10 border border-white/10 text-slate-200 rounded-2xl rounded-bl-none'
                  }`}>
                  {msg.text.split('\n').map((line, i) => (
                      <p key={i} className="mb-1 last:mb-0 leading-relaxed font-medium">
                          {line || <br />}
                      </p>
                  ))}
                </div>

            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start items-end">
            <div className="w-8 h-8 rounded-full bg-purple-500 mr-2 -mb-2 flex items-center justify-center z-10 shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-5 py-4 bg-white/10 border border-white/10 rounded-2xl rounded-bl-none flex space-x-2 items-center h-12">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
        <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputVal); }} 
            className="flex items-center gap-3 relative"
        >
          <input 
            className="flex-1 bg-white/5 border border-white/20 rounded-full px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium" 
            placeholder="Type your message here..." 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-indigo-500/30"
          >
            <Send className="w-6 h-6 ml-1" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
