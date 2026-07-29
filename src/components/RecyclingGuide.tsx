import React, { useState } from 'react';
import { Search, Recycle, CheckCircle2, XCircle, AlertTriangle, Sparkles, Send, Bot } from 'lucide-react';
import { RECYCLING_ITEMS } from '../data/ecoContent';
import { RecyclingGuideItem } from '../types';

interface RecyclingGuideProps {
  onAskAi: (prompt: string) => void;
}

export const RecyclingGuideComponent: React.FC<RecyclingGuideProps> = ({ onAskAi }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customItemQuery, setCustomItemQuery] = useState('');

  const categories = ['All', 'Plastics', 'Paper & Cardboard', 'Glass', 'Metals', 'E-Waste'];

  const filteredItems = RECYCLING_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAskAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemQuery.trim()) return;
    onAskAi(`Is '${customItemQuery}' recyclable? Give me clear bin instructions, preparation steps (rinsing, removing caps), and warnings about contamination.`);
    setCustomItemQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[32px] p-6 sm:p-8 shadow-md space-y-5 relative overflow-hidden">
        <div className="flex items-center space-x-3 z-10 relative">
          <div className="p-2.5 bg-white/10 rounded-full backdrop-blur-md">
            <Recycle className="w-6 h-6 text-[#A7C957]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A7C957]">
              Waste & Recycling Wisdom
            </span>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-light italic text-[#F7F8F3]">
              Recycling Intelligence Guide
            </h2>
          </div>
        </div>

        {/* AI Recycling Lookup Form */}
        <form onSubmit={handleAskAiSubmit} className="relative z-10 bg-white border border-[#1B3022]/20 rounded-full p-2 flex items-center shadow-xs">
          <div className="pl-4 text-[#6A994E]">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={customItemQuery}
            onChange={(e) => setCustomItemQuery(e.target.value)}
            placeholder="Ask EcoBuddy: 'Can I recycle bubble wrap?' or 'How to recycle a lightbulb?'..."
            className="flex-1 bg-transparent border-none text-xs text-[#1B3022] placeholder-[#1B3022]/50 px-3 focus:outline-none italic"
          />
          <button
            type="submit"
            className="bg-[#1B3022] hover:bg-[#A7C957] text-[#F7F8F3] hover:text-[#1B3022] font-bold px-5 py-2.5 rounded-full text-xs transition-colors flex items-center gap-1.5 uppercase tracking-widest text-[10px]"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#122217] p-4 rounded-[24px] border border-[#1B3022]/10 dark:border-white/10 shadow-2xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#1B3022]/40 dark:text-[#F7F8F3]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items (e.g., bottle, glass)..."
            className="w-full pl-9 pr-4 py-2 bg-[#F7F8F3] dark:bg-[#0B160E] border border-[#1B3022]/15 dark:border-white/20 rounded-full text-xs text-[#1B3022] dark:text-[#F7F8F3] placeholder-[#1B3022]/40 dark:placeholder-white/40 focus:outline-none focus:border-[#A7C957] italic transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1B3022] dark:bg-[#A7C957] text-[#F7F8F3] dark:text-[#1B3022]'
                  : 'bg-[#F7F8F3] dark:bg-white/10 text-[#1B3022]/70 dark:text-[#F7F8F3]/70 border border-[#1B3022]/10 dark:border-white/10 hover:bg-[#E8EDE0] dark:hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-[#122217] rounded-[24px] p-6 border shadow-2xs space-y-4 flex flex-col justify-between ${
              item.isRecyclable ? 'border-[#1B3022]/10 dark:border-white/10' : 'border-amber-300/40 dark:border-amber-400/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3022]/50 dark:text-[#F7F8F3]/60 bg-[#E8EDE0] dark:bg-white/10 px-3 py-1 rounded-full border border-[#1B3022]/10 dark:border-white/10">
                  {item.category}
                </span>

                {item.isRecyclable ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-[#1B3022] dark:text-[#A7C957] bg-[#A7C957]/30 dark:bg-[#A7C957]/20 border border-[#1B3022]/10 dark:border-white/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6A994E] dark:text-[#A7C957]" />
                    <span>Curbside Recyclable</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Special Handling</span>
                  </span>
                )}
              </div>

              <h3 className="editorial-serif text-2xl font-normal italic text-[#1B3022] dark:text-[#F7F8F3] flex items-center space-x-2">
                <span>{item.name}</span>
                {item.recyclingCode && (
                  <span className="text-xs font-mono bg-[#E8EDE0] dark:bg-white/10 text-[#1B3022] dark:text-[#A7C957] px-2 py-0.5 rounded-full font-bold not-italic">
                    {item.recyclingCode}
                  </span>
                )}
              </h3>

              <p className="text-xs text-[#1B3022]/75 dark:text-[#F7F8F3]/80 mt-2 leading-relaxed">{item.instructions}</p>

              {item.doNotInclude && (
                <div className="mt-3 text-[11px] text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-900/30 p-3 rounded-[16px] border border-rose-100 dark:border-rose-800/40">
                  <strong>Do NOT include:</strong> {item.doNotInclude}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1B3022]/10 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => onAskAi(`How do I prepare ${item.name} for recycling and what are common mistakes to avoid?`)}
                className="text-xs font-bold text-[#1B3022] dark:text-[#F7F8F3] hover:text-[#6A994E] dark:hover:text-[#A7C957] flex items-center space-x-1.5 uppercase tracking-wider text-[10px] cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-[#6A994E] dark:text-[#A7C957]" />
                <span>Ask EcoBuddy Detailed Instructions</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

