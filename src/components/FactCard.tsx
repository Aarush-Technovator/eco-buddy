import React, { useState } from 'react';
import { Lightbulb, Sparkles, RefreshCw, Send, ArrowRight, BookOpen } from 'lucide-react';
import { EnvironmentalFact } from '../types';
import { INITIAL_FACTS } from '../data/ecoContent';

interface FactCardProps {
  onAskAiAboutFact: (factText: string) => void;
}

export const FactCardComponent: React.FC<FactCardProps> = ({ onAskAiAboutFact }) => {
  const [factsList, setFactsList] = useState<EnvironmentalFact[]>(INITIAL_FACTS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentFact = factsList[currentIdx % factsList.length] || INITIAL_FACTS[0];

  const handleNextFact = () => {
    setCurrentIdx((prev) => (prev + 1) % factsList.length);
  };

  const handleGenerateAiFact = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-fact');
      if (res.ok) {
        const data = await res.json();
        const newFact: EnvironmentalFact = {
          id: `fact-ai-${Date.now()}`,
          fact: data.fact || 'Recycling saves immense amounts of raw natural resource extraction.',
          context: data.context || 'Small everyday choices compound into massive global reductions.',
          actionableTip: data.actionableTip || 'Incorporate one green habit into your day.',
          category: 'facts',
          statNumber: data.statNumber || '100%',
          statLabel: data.statLabel || 'Impactful',
        };
        setFactsList((prev) => [newFact, ...prev]);
        setCurrentIdx(0);
      }
    } catch (err) {
      console.error('Failed to generate fact:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Fact Spotlight */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <span className="bg-[#A7C957]/20 border border-[#A7C957]/30 text-[#A7C957] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#A7C957]" />
            <span>Did You Know?</span>
          </span>

          <span className="text-xs text-[#F7F8F3]/70 font-medium italic">
            Entry {currentIdx + 1} of {factsList.length}
          </span>
        </div>

        {/* Big Stat Callout & Fact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
          <div className="md:col-span-2 space-y-4">
            <h2 className="editorial-serif text-3xl sm:text-4xl font-light italic text-[#F7F8F3] leading-tight">
              "{currentFact.fact}"
            </h2>
            <p className="text-xs sm:text-sm text-[#F7F8F3]/80 leading-relaxed">
              {currentFact.context}
            </p>

            <div className="bg-white/10 p-4 rounded-[18px] border border-white/10 text-xs text-[#A7C957] font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A7C957] flex-shrink-0" />
              <span><strong>Actionable Step:</strong> {currentFact.actionableTip}</span>
            </div>
          </div>

          {/* Stat Badge */}
          {currentFact.statNumber && (
            <div className="bg-white/10 p-6 rounded-[24px] border border-white/10 text-center space-y-1 backdrop-blur-md">
              <div className="editorial-serif italic text-4xl sm:text-5xl font-light text-[#A7C957] tracking-tight">
                {currentFact.statNumber}
              </div>
              <div className="text-[10px] text-[#F7F8F3]/80 font-bold uppercase tracking-widest">
                {currentFact.statLabel}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <button
            onClick={() => onAskAiAboutFact(`Can you elaborate more on this environmental fact: "${currentFact.fact}"? Give me the scientific background and what communities are doing about it.`)}
            className="flex items-center space-x-2 bg-[#A7C957] hover:bg-white text-[#1B3022] font-bold px-5 py-3 rounded-full text-[10px] uppercase tracking-widest transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Deep Dive with EcoBuddy</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNextFact}
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F8F3] text-[10px] uppercase tracking-widest font-bold transition"
            >
              Next Entry
            </button>

            <button
              onClick={handleGenerateAiFact}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-full bg-[#E8EDE0] hover:bg-white text-[#1B3022] text-[10px] uppercase tracking-widest font-bold transition shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Curating...' : 'Discover AI Fact'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Facts Archive Grid */}
      <div className="space-y-4">
        <h3 className="editorial-serif text-2xl font-normal italic text-[#1B3022]">Environmental Trivia Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factsList.map((f, idx) => (
            <div
              key={f.id}
              onClick={() => setCurrentIdx(idx)}
              className={`p-5 rounded-[20px] bg-white border cursor-pointer transition shadow-2xs space-y-2 ${
                idx === currentIdx ? 'border-[#1B3022] bg-[#E8EDE0]/30' : 'border-[#1B3022]/10 hover:border-[#1B3022]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3022] bg-[#E8EDE0] px-2.5 py-0.5 rounded-full">
                  {f.category}
                </span>
                <span className="editorial-serif italic text-base font-bold text-[#6A994E]">{f.statNumber}</span>
              </div>
              <h4 className="editorial-serif italic text-lg text-[#1B3022] line-clamp-2">{f.fact}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

