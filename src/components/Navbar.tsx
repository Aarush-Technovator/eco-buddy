import React from 'react';
import { Leaf, MessageSquare, Lightbulb, Zap, Recycle, Bike, Trophy, Flame, Award, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userPoints: number;
  streakDays: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userPoints,
  streakDays,
  darkMode,
  onToggleDarkMode,
}) => {
  const navItems = [
    { id: 'chat', label: 'AI Chatbot', icon: MessageSquare },
    { id: 'tip', label: 'Daily Eco Tip', icon: Lightbulb },
    { id: 'energy-water', label: 'Water & Energy', icon: Zap },
    { id: 'recycling', label: 'Recycling Guide', icon: Recycle },
    { id: 'transport', label: 'Sustainable Transport', icon: Bike },
    { id: 'challenge', label: 'Weekly Challenge', icon: Trophy },
  ];

  return (
    <header className="bg-[#F7F8F3]/90 dark:bg-[#0B160E]/90 backdrop-blur-md border-b border-[#1B3022]/10 dark:border-white/10 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="w-8 h-8 rounded-full bg-[#A7C957] flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 rounded-full bg-[#1B3022] flex items-center justify-center text-[#A7C957]">
                <Leaf className="w-2.5 h-2.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="editorial-serif text-2xl font-semibold tracking-tight italic text-[#1B3022] dark:text-[#F7F8F3]">
                  EcoBuddy
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-[#E8EDE0] dark:bg-white/10 text-[#1B3022] dark:text-[#A7C957] rounded-full border border-[#1B3022]/10 dark:border-white/10">
                  AI ASSISTANT
                </span>
              </div>
            </div>
          </div>

          {/* User Streak & Rewards Badge + Dark Mode Switch */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1.5 bg-[#E8EDE0] dark:bg-white/10 border border-[#1B3022]/10 dark:border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#1B3022] dark:text-[#F7F8F3]">
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
              <span className="text-[11px] font-bold tracking-wide">{streakDays} Day Streak</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#A7C957]/30 dark:bg-[#A7C957]/20 border border-[#1B3022]/10 dark:border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#1B3022] dark:text-[#A7C957]">
              <Award className="w-3.5 h-3.5 text-[#6A994E] dark:text-[#A7C957]" />
              <span className="text-[11px] font-bold tracking-wide">{userPoints} pts</span>
            </div>

            {/* Dark/Light Mode Switch Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full border border-[#1B3022]/15 dark:border-white/20 bg-[#E8EDE0]/80 dark:bg-white/10 text-[#1B3022] dark:text-[#A7C957] hover:bg-[#A7C957]/30 dark:hover:bg-white/20 transition-all shadow-2xs flex items-center justify-center cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-[#1B3022]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto pb-2.5 scrollbar-none pt-1 border-t border-[#1B3022]/10 dark:border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#1B3022] dark:bg-[#A7C957] text-[#F7F8F3] dark:text-[#1B3022] shadow-xs'
                    : 'text-[#1B3022]/70 dark:text-[#F7F8F3]/70 hover:bg-[#E8EDE0] dark:hover:bg-white/10 hover:text-[#1B3022] dark:hover:text-[#F7F8F3]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#A7C957] dark:text-[#1B3022]' : 'opacity-60'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};


