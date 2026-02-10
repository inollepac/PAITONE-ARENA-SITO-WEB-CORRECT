
import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig, Page } from '../types';
import { getChatbotResponse } from '../services/geminiService';

interface ChatBotProps {
  config: SiteConfig;
  onBookingClick: () => void;
  onNavigate: (page: Page) => void;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC<ChatBotProps> = ({ config, onBookingClick, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Benvenuto in Arena! 👋 Come posso aiutarti oggi?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    const botReply = await getChatbotResponse(text, config);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
  };

  const shortcuts = [
    { label: '🎾 Prenota', action: () => { onBookingClick(); setIsOpen(false); } },
    { label: '🕒 Orari', action: () => handleSend("Quali sono gli orari dell'Arena?") },
    { label: '📍 Dove', action: () => handleSend("Dove si trova l'Arena?") },
    { label: '👨‍🏫 Corsi', action: () => { onNavigate('courses'); setIsOpen(false); } },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[600px] bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(78,91,131,0.3)] border border-brand-green/20 mb-6 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-400">
          {/* Header */}
          <div className="p-8 bg-brand-blue text-white flex items-center justify-between relative overflow-hidden">
            <div className="circle-accent w-40 h-40 -top-20 -right-20"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center text-brand-blue shadow-lg">
                <i className="fas fa-baseball-ball text-2xl"></i>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tighter text-xl">Arena Bot</h4>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse shadow-[0_0_5px_#A8D38E]"></div>
                    <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">Active Assistant</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-brand-green transition-colors relative z-10">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-brand-light/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                  m.sender === 'user' 
                  ? 'bg-brand-blue text-white rounded-tr-none' 
                  : 'bg-white text-brand-blue rounded-tl-none border border-brand-green/10'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white px-5 py-4 rounded-[2rem] rounded-tl-none border border-brand-green/10 shadow-sm flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            )}
          </div>

          {/* Shortcuts */}
          <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar bg-white/50 border-t border-brand-blue/5">
             {shortcuts.map((s, i) => (
               <button 
                key={i} 
                onClick={s.action}
                className="whitespace-nowrap px-4 py-2 bg-white border border-brand-green/20 rounded-full text-[10px] font-black text-brand-blue uppercase tracking-widest hover:bg-brand-green hover:border-brand-green transition-all shadow-sm shrink-0"
               >
                 {s.label}
               </button>
             ))}
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="p-6 bg-white border-t border-brand-blue/5 flex gap-4"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Fai una domanda all'Arena..."
              className="flex-grow px-6 py-4 bg-brand-light rounded-full text-sm font-medium text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
            <button 
              type="submit"
              className="w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg active:scale-95"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-20 h-20 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-[0_16px_32px_-8px_rgba(78,91,131,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-green translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <i className={`fas ${isOpen ? 'fa-chevron-down' : 'fa-comment-alt'} text-3xl relative z-10 group-hover:text-brand-blue transition-colors`}></i>
        {!isOpen && (
            <span className="absolute top-4 right-4 w-4 h-4 bg-brand-green border-2 border-brand-blue rounded-full animate-pulse z-20"></span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
