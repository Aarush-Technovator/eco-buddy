import React, { useState } from 'react';
import { Lightbulb, Bookmark, BookmarkCheck, Sparkles, RefreshCw, Droplet, Zap, Recycle, Bike, ArrowRight } from 'lucide-react';
import { EcoTip, EcoCategory } from '../types';
import { INITIAL_TIPS } from '../data/ecoContent';

interface DailyTipCardProps {
  onAskChatAboutTip: (tip: EcoTip) => void;
  savedTipIds: string[];
  onToggleSaveTip: (tipId: string) => void;
}

export const DailyTipCard: React.FC<DailyTipCardProps> = ({
  onAskChatAboutTip,
  savedTipIds,
  onToggleSaveTip,
}) => {
  const [tipsList, setTipsList] = useState<EcoTip[]>(INITIAL_TIPS);
  const [selectedCategory, setSelectedCategory] = useState<EcoCategory>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const filteredTips = selectedCategory === 'all'
    ? tipsList
    : tipsList.filter(t => t.category === selectedCategory);

  const currentTip = filteredTips[activeTipIndex % (filteredTips.length || 1)] || INITIAL_TIPS[0];

  const handleNextTip = () => {
    setActiveTipIndex((prev) => (prev + 1) % filteredTips.length);
  };

  const handleGenerateAiTip = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedCategory === 'all' ? 'sustainability' : selectedCategory }),
      });
      if (response.ok) {
        const data = await response.json();
        const newTip: EcoTip = {
          id: `ai-tip-${Date.now()}`,
          title: data.title || 'Fresh Sustainability Tip',
          description: data.description || 'Actionable eco step for your daily routine.',
          category: (data.category?.toLowerCase() as EcoCategory) || selectedCategory || 'general',
          impact: data.impact || 'High Environmental Impact',
          difficulty: 'Easy',
        };
        setTipsList((prev) => [newTip, ...prev]);
        setActiveTipIndex(0);
      }
    } catch (err) {
      console.error('Failed to generate tip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const isSaved = savedTipIds.includes(currentTip.id);

  const getCategoryBadge = (cat: EcoCategory) => {
    switch (cat) {
      case 'water':
        return { label: 'Water Saving', icon: Droplet, color: 'bg-[#E8EDE0] text-[#1B3022] border-[#1B3022]/10' };
      case 'electricity':
        return { label: 'Electricity & Energy', icon: Zap, color: 'bg-[#E8EDE0] text-[#1B3022] border-[#1B3022]/10' };
      case 'recycling':
        return { label: 'Recycling', icon: Recycle, color: 'bg-[#E8EDE0] text-[#1B3022] border-[#1B3022]/10' };
      case 'transport':
        return { label: 'Sustainable Transport', icon: Bike, color: 'bg-[#E8EDE0] text-[#1B3022] border-[#1B3022]/10' };
      default:
        return { label: 'Eco Habits', icon: Lightbulb, color: 'bg-[#E8EDE0] text-[#1B3022] border-[#1B3022]/10' };
    }
  };

  const badge = getCategoryBadge(currentTip.category);
  const BadgeIcon = badge.icon;

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'water', 'electricity', 'recycling', 'transport'] as EcoCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveTipIndex(0);
            }}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1B3022] dark:bg-[#A7C957] text-[#F7F8F3] dark:text-[#1B3022] shadow-xs'
                : 'bg-white dark:bg-white/10 text-[#1B3022]/70 dark:text-[#F7F8F3]/70 border border-[#1B3022]/10 dark:border-white/10 hover:bg-[#E8EDE0] dark:hover:bg-white/20'
            }`}
          >
            {cat === 'electricity' ? 'Energy' : cat}
          </button>
        ))}
      </div>

      {/* Main Spotlight Featured Tip Card */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[32px] p-6 sm:p-8 relative shadow-md overflow-hidden flex flex-col justify-between min-h-[300px]">
        {/* Abstract Background Blur */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#A7C957]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Category & Actions Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A7C957]">
              Daily Eco Insight
            </span>
            <span className="text-[10px] bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full text-[#F7F8F3]/80 font-medium">
              Difficulty: {currentTip.difficulty}
            </span>
          </div>

          <button
            onClick={() => onToggleSaveTip(currentTip.id)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#A7C957] transition"
            title={isSaved ? 'Remove from saved' : 'Save tip'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-[#A7C957]" />
            ) : (
              <Bookmark className="w-5 h-5 text-white/80" />
            )}
          </button>
        </div>

        {/* Tip Details */}
        <div className="space-y-4 relative z-10 my-auto">
          <h2 className="editorial-serif text-3xl sm:text-4xl font-light italic leading-tight text-[#F7F8F3]">
            “{currentTip.title}”
          </h2>
          <p className="text-xs sm:text-sm text-[#F7F8F3]/80 leading-relaxed max-w-2xl">
            {currentTip.description}
          </p>

          {/* Impact Banner */}
          <div className="inline-flex items-center space-x-2 bg-[#A7C957]/20 border border-[#A7C957]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#A7C957]">
            <Sparkles className="w-3.5 h-3.5 text-[#A7C957]" />
            <span>Estimated Impact: <strong>{currentTip.impact}</strong></span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <button
            onClick={() => onAskChatAboutTip(currentTip)}
            className="px-6 py-2.5 bg-[#A7C957] text-[#1B3022] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center space-x-2"
          >
            <span>Ask EcoBuddy How To Implement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNextTip}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F8F3] text-xs font-semibold transition"
            >
              Next Tip ({activeTipIndex + 1}/{filteredTips.length})
            </button>

            <button
              onClick={handleGenerateAiTip}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'AI Generating...' : 'New AI Tip'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Saved or Other Tips */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B3022]/60 dark:text-[#F7F8F3]/60 flex items-center justify-between">
          <span>Curated Eco Tips Archive</span>
          <span className="text-xs text-[#1B3022]/50 dark:text-[#F7F8F3]/50 font-normal italic">{tipsList.length} tips available</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipsList.map((t) => {
            const b = getCategoryBadge(t.category);
            const BIcon = b.icon;
            const saved = savedTipIds.includes(t.id);
            return (
              <div
                key={t.id}
                className="bg-white dark:bg-[#122217] rounded-[24px] p-6 border border-[#1B3022]/10 dark:border-white/10 shadow-2xs hover:border-[#1B3022]/30 dark:hover:border-white/30 transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold opacity-50 tracking-wider text-[#1B3022] dark:text-[#F7F8F3]">
                      {b.label}
                    </span>

                    <button
                      onClick={() => onToggleSaveTip(t.id)}
                      className="text-[#1B3022]/40 dark:text-white/40 hover:text-[#1B3022] dark:hover:text-white transition cursor-pointer"
                    >
                      {saved ? (
                        <BookmarkCheck className="w-4 h-4 text-[#6A994E] dark:text-[#A7C957]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h4 className="editorial-serif text-2xl font-normal italic text-[#1B3022] dark:text-[#F7F8F3] leading-snug">{t.title}</h4>
                  <p className="text-xs text-[#1B3022]/70 dark:text-[#F7F8F3]/80 mt-2 line-clamp-2 leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-[#1B3022]/10 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#6A994E] dark:text-[#A7C957] font-medium text-[11px] italic">{t.impact}</span>
                  <button
                    onClick={() => onAskChatAboutTip(t)}
                    className="text-[#1B3022] dark:text-[#F7F8F3] hover:text-[#6A994E] dark:hover:text-[#A7C957] font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Discuss</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

