import React, { useState, useRef, useEffect } from 'react';
import { getConsultationAdvice } from '../services/geminiService';
import { MessageRole, ChatMessage } from '../types';
import { Button } from './ui/Button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ConsultantAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: MessageRole.MODEL,
      text: 'Hello! I am the Chrimson AI Assistant. Unsure if you need a Pty Ltd, Sole Proprietor, or NPO? Describe your business idea, and I will recommend the best structure.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const advice = await getConsultationAdvice(input);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.MODEL,
      text: advice
    };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <section id="consultant-ai" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-chrimson-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-namibia-sky/10 rounded-full blur-[100px]"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
             <Sparkles className="w-4 h-4 text-namibia-sun" />
             <span className="text-sm font-medium">Powered by Gemini AI</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Not sure where to start?</h2>
          <p className="text-slate-300">Ask our AI consultant to guide your registration choice.</p>
        </div>

        <div className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-[500px] flex flex-col">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex gap-3 ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === MessageRole.USER ? 'bg-slate-700' : 'bg-chrimson-600'}`}>
                  {msg.role === MessageRole.USER ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === MessageRole.USER 
                    ? 'bg-slate-800 text-white rounded-tr-sm' 
                    : 'bg-white/10 text-slate-100 border border-white/5 rounded-tl-sm'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1 last:mb-0'}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-chrimson-600 flex items-center justify-center"><Bot size={14} /></div>
                 <div className="bg-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-slate-900/50">
            <div className="relative flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: I want to start a tourism shuttle service..."
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-chrimson-500 outline-none"
              />
              <Button 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                className="!p-3 !rounded-xl"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};