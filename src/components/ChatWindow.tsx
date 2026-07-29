import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Sparkles, Copy, Check, RefreshCw, Leaf, Droplet, Zap, Recycle, Bike, Lightbulb, Trophy } from 'lucide-react';
import { ChatMessage, EcoCategory } from '../types';
import { QUICK_PROMPTS } from '../data/ecoContent';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, category?: EcoCategory) => Promise<void>;
  isLoading: boolean;
  onSelectCategoryTopic?: (cat: EcoCategory) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSelectCategoryTopic,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    onSendMessage(userText);
  };

  const handleQuickPromptClick = (promptText: string) => {
    if (isLoading) return;
    onSendMessage(promptText);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categoryShortcuts = [
    { label: 'Water Advice', cat: 'water' as EcoCategory, icon: Droplet },
    { label: 'Energy Saving', cat: 'electricity' as EcoCategory, icon: Zap },
    { label: 'Recycling Helper', cat: 'recycling' as EcoCategory, icon: Recycle },
    { label: 'Transport Tips', cat: 'transport' as EcoCategory, icon: Bike },
    { label: 'Eco Facts', cat: 'facts' as EcoCategory, icon: Lightbulb },
    { label: 'Green Challenge', cat: 'challenge' as EcoCategory, icon: Trophy },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-9.5rem)] bg-white/70 rounded-[24px] border border-[#1B3022]/10 shadow-xs overflow-hidden">
      {/* Top Bar / Category Topic Bar */}
      <div className="px-5 py-3.5 bg-white/60 border-b border-[#1B3022]/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#1B3022] text-[#A7C957] flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="editorial-serif text-xl font-semibold italic text-[#1B3022] flex items-center gap-2">
              EcoBuddy Assistant
              <span className="w-2 h-2 rounded-full bg-[#A7C957] animate-pulse"></span>
            </h2>
            <p className="text-[11px] text-[#1B3022]/60">Ask about saving water, energy efficiency, recycling, or green mobility</p>
          </div>
        </div>

        {/* Quick Category Jump Buttons */}
        <div className="hidden lg:flex items-center space-x-2">
          {categoryShortcuts.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.cat}
                onClick={() => {
                  if (onSelectCategoryTopic) onSelectCategoryTopic(item.cat);
                  handleQuickPromptClick(`Give me high-impact ${item.label.toLowerCase()} for my daily routine.`);
                }}
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#1B3022]/15 bg-[#E8EDE0]/50 hover:bg-[#A7C957] text-[#1B3022] transition-colors flex items-center gap-1.5"
              >
                <Icon className="w-3 h-3 text-[#1B3022]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F7F8F3]/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#A7C957] text-[#1B3022] flex items-center justify-center shadow-md">
              <Leaf className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 text-[#1B3022]">Sustainable AI Companion</span>
              <h3 className="editorial-serif text-3xl font-light italic text-[#1B3022]">Welcome to EcoBuddy</h3>
              <p className="text-xs text-[#1B3022]/70 leading-relaxed">
                I’m your dedicated AI sustainability assistant. I can calculate water footprint savings, optimize home power consumption, solve recycling ambiguities, and guide your daily eco missions!
              </p>
            </div>

            {/* Starter Prompts Grid */}
            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(qp.prompt)}
                  className="p-3.5 bg-white hover:bg-[#E8EDE0] border border-[#1B3022]/10 rounded-[18px] text-xs font-medium text-[#1B3022] transition flex items-start space-x-2.5 shadow-2xs group"
                >
                  <Sparkles className="w-4 h-4 text-[#6A994E] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="editorial-serif italic text-sm text-[#1B3022]">{qp.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-[#1B3022] text-[#F7F8F3]'
                    : 'bg-[#A7C957] text-[#1B3022]'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#1B3022]" />}
              </div>

              {/* Message Content Container */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 relative group transition ${
                  msg.role === 'user'
                    ? 'bg-[#1B3022] text-[#F7F8F3] rounded-[20px] rounded-tr-none'
                    : 'bg-[#E8EDE0] text-[#1B3022] border border-[#1B3022]/10 rounded-[20px] rounded-tl-none'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between mb-2 text-[10px] opacity-60 border-b border-[#1B3022]/10 pb-1">
                  <span className="editorial-serif italic font-semibold text-xs">
                    {msg.role === 'user' ? 'You' : 'EcoBuddy'}
                  </span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Text Body */}
                {msg.role === 'user' ? (
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-xs max-w-none text-xs text-[#1B3022] leading-relaxed space-y-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}

                {/* Copy Button */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyMessage(msg.id, msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-white/80 hover:bg-white text-[#1B3022] transition"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-[#6A994E]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#A7C957] text-[#1B3022] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 text-[#1B3022]" />
            </div>
            <div className="bg-[#E8EDE0] border border-[#1B3022]/10 rounded-[20px] rounded-tl-none p-4 shadow-2xs flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-[#1B3022] animate-spin" />
              <span className="text-xs text-[#1B3022] font-medium editorial-serif italic">EcoBuddy is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white/80 border-t border-[#1B3022]/10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about recycling, energy, transport..."
            className="w-full bg-white border border-[#1B3022]/20 rounded-full px-6 py-3.5 pr-14 text-xs text-[#1B3022] placeholder-[#1B3022]/50 focus:outline-none focus:border-[#A7C957] shadow-2xs italic"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 w-9 h-9 rounded-full bg-[#1B3022] disabled:opacity-40 text-[#F7F8F3] hover:bg-[#A7C957] hover:text-[#1B3022] transition-colors flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Categories Bar Below Input */}
        <div className="flex items-center justify-between mt-2 px-2 text-[10px] text-[#1B3022]/60 overflow-x-auto space-x-2">
          <span className="font-bold uppercase tracking-wider text-[9px] opacity-60 whitespace-nowrap">Popular topics:</span>
          <div className="flex items-center space-x-3">
            {QUICK_PROMPTS.slice(0, 3).map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickPromptClick(p.prompt)}
                className="hover:text-[#1B3022] hover:underline whitespace-nowrap italic text-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

