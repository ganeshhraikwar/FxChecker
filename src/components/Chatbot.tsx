import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export function Chatbot({ context }: { context?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hi! I'm your financial assistant. How can I help you with currencies or finance today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format messages for Gemini API
      const apiMessages = newMessages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, context })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-fx-accent outline-none text-fx-bg shadow-lg hover:bg-fx-accent/90 transition-all z-40 focus:ring-4 focus:ring-fx-accent/30",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-full max-w-sm sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-fx-panel border border-fx-border rounded-2xl shadow-2xl overflow-hidden z-50 pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-fx-border bg-[#1b1b1e]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-fx-accent/20 flex items-center justify-center text-fx-accent">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-200 uppercase tracking-widest text-xs">AI Assistant</h3>
                  <p className="text-[10px] text-fx-text-dim tracking-widest uppercase">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-fx-text-dim hover:text-gray-200 hover:bg-[#242428] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-[#242428] text-gray-300" : "bg-fx-accent/20 text-fx-accent"
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "rounded-xl px-4 py-3 mt-1",
                    msg.role === 'user' 
                      ? "bg-fx-accent text-fx-bg font-medium rounded-tr-sm" 
                      : "bg-[#242428] text-gray-300 rounded-tl-sm border border-fx-border text-[13px]"
                  )}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="markdown-body prose prose-invert prose-p:leading-relaxed prose-pre:bg-fx-bg max-w-none text-[13px]">
                         <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-fx-accent/20 text-fx-accent flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-[#242428] rounded-xl border border-fx-border px-4 py-3 mt-1 rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-fx-accent" />
                    <span className="text-fx-text-dim text-xs tracking-widest uppercase">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-fx-border bg-[#1b1b1e]">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about rates or tips..."
                  className="w-full bg-[#242428] border border-fx-border rounded-full pl-4 pr-12 py-3 text-sm font-mono focus:outline-none focus:border-fx-accent text-gray-200 placeholder:text-fx-text-dim transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-full bg-fx-accent text-fx-bg disabled:opacity-50 disabled:bg-[#242428] disabled:text-fx-text-dim transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
