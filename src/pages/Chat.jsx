import React, { useState, useEffect, useRef } from 'react';
// Make sure you have react-router-dom installed! (npm install react-router-dom)
import { useNavigate } from 'react-router-dom';

// --- Helper component for the Send Icon ---
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
    <path d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
  </svg>
);

// --- Helper component for the Read Ticks ---
const ReadTicks = () => (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="#4fc3f7" strokeWidth="1.2">
        <path d="m1.021 10.337 3.333 3.333 3.333-6.667"/>
        <path d="m7.688 10.337 3.333 3.333 6.667-10"/>
    </svg>
);

function Chat() {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([
      {
        role: "assistant",
        content: "Hey there! 👋 I'm Aurum AI, your personal gold investment assistant. Ask me anything about digital gold, ETFs, or SGBs! 💰"
      }
  ]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showBuyButton, setShowBuyButton] = useState(false);
  const [showDashboardButton, setShowDashboardButton] = useState(false); // CHANGED: Renamed state for clarity
  
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const handleSuggestionClick = (suggestion) => {
    // Directly send the suggestion when clicked
    handleSend(suggestion);
  };
  
  const handleSend = async (messageToSend = query) => {
    if (!messageToSend.trim()) return;

    const newChat = [...chat, { role: "user", content: messageToSend }];
    setChat(newChat);
    setQuery("");
    setLoading(true);
    
    // Reset buttons for every new message
    setSuggestions([]);
    setShowBuyButton(false);
    setShowDashboardButton(false); // CHANGED: Reset the new state variable

    try {
      const res = await fetch("https://chatgold-1.onrender.com/api/v1/chat/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: messageToSend }),
      });

      const data = await res.json();
      console.log(data);
      

      if (data.answer) {
        setChat((prev) => [...prev, { role: "assistant", content: data.answer }]);
        
        let parsedSuggestions = [];
        if (Array.isArray(data.suggestion)) {
            parsedSuggestions = data.suggestion;
        } else if (typeof data.suggestion === 'string') {
            try {
                parsedSuggestions = JSON.parse(data.suggestion);
            } catch { /* Ignore parsing errors */ }
        }
        setSuggestions(Array.isArray(parsedSuggestions) ? parsedSuggestions : []);
        
        // Set button visibility based on backend response
        setShowBuyButton(Boolean(data.showBuyButton));
        setShowDashboardButton(data.intention === 1); // CHANGED: Set dashboard button visibility

      }
    } catch (err) {
      console.error("Error fetching:", err);
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Oops, couldn't connect. Pls try again in a bit." },
      ]);
      setShowBuyButton(false);
      setShowDashboardButton(false); // CHANGED: Also hide on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-[#E5DDD5] p-4 font-sans"
      style={{ backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAARCAYAAAA/VMu8AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS41ZEdYUgAAAZFJREFUeF7t1M1xwkAQBNCpbeEPLbQp9a+9I22pvwAF0kITdoE8YyI4fgzZ2M/L5v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d8v7d...` }}
    >
      <div className="w-full max-w-3xl h-[95vh] flex flex-col bg-transparent shadow-2xl rounded-lg text-gray-900">
        
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-2 bg-[#075E54] text-white rounded-t-lg shadow-md">
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl">💰</span>
            </div>
            <div className='flex-grow'>
                <h1 className="text-lg font-medium">Aurum AI</h1>
                <p className="text-xs text-gray-200">online</p>
            </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chat.map((msg, i) => {
            const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            return (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-sm md:max-w-md py-2 px-3 rounded-lg shadow ${msg.role === 'user' ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      <div className="text-right text-xs text-gray-400 mt-1 flex justify-end items-center gap-1">
                          <span>{time}</span>
                          {msg.role === 'user' && <ReadTicks />}
                      </div>
                  </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex justify-start">
               <div className="relative max-w-sm py-2 px-3 rounded-lg shadow bg-white rounded-tl-none">
                 <div className="flex items-center space-x-1 p-2">
                   <span className="dot-loader-wa"></span>
                   <span className="dot-loader-wa delay-200"></span>
                   <span className="dot-loader-wa delay-400"></span>
                 </div>
               </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Action Buttons & Input */}
        <div className="p-2 bg-transparent">
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 justify-center">
                    {suggestions.map((q, i) => (
                    <button
                        key={i}
                        className="px-4 py-2 text-sm bg-white text-[#075E54] rounded-full hover:bg-gray-200 transition-colors duration-300 shadow"
                        onClick={() => handleSuggestionClick(q)}
                    >
                        {q}
                    </button>
                    ))}
                </div>
            )}
            
            <div className="flex flex-col gap-2 mb-2">
                {showBuyButton && (
                    <button
                        onClick={() => console.log("Navigate to /buy-gold")}
                        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold px-4 py-3 rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-lg"
                    >
                        💰 Buy Gold Now
                    </button>
                )}

                {/* --- CHANGED BLOCK START --- */}
                {showDashboardButton && (
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                    >
                        📊 Go to Dashboard
                    </button>
                )}
                {/* --- CHANGED BLOCK END --- */}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-grow bg-white border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !query.trim()}
                className="bg-[#128C7E] w-12 h-12 flex items-center justify-center text-white p-3 rounded-full hover:bg-[#075E54] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 shadow-lg"
              >
                <SendIcon />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;