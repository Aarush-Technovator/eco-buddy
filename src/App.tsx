/**
 * Eco Buddy Chatbot - Sustainability AI Assistant
 * Built with React, Tailwind CSS, Express, and Google Gemini API (@google/genai)
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { DailyTipCard } from './components/DailyTipCard';
import { WeeklyChallengeComponent } from './components/WeeklyChallenge';
import { RecyclingGuideComponent } from './components/RecyclingGuide';
import { EnergyWaterCalculatorComponent } from './components/EnergyWaterCalculator';
import { TransportCalculatorComponent } from './components/TransportCalculator';
import { FactCardComponent } from './components/FactCard';
import { ExportNetlifyModal } from './components/ExportNetlifyModal';
import { ChatMessage, EcoCategory, EcoTip } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('eco_buddy_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User stats & state
  const [userPoints, setUserPoints] = useState<number>(() => {
    return Number(localStorage.getItem('eco_user_points')) || 120;
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    return Number(localStorage.getItem('eco_user_streak')) || 3;
  });
  const [savedTipIds, setSavedTipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco_saved_tips');
    return saved ? JSON.parse(saved) : ['tip-1', 'tip-5'];
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Dark / Light Theme Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eco_dark_mode');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse dark mode setting:', e);
      }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('eco_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('eco_buddy_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('eco_user_points', userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('eco_user_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('eco_saved_tips', JSON.stringify(savedTipIds));
  }, [savedTipIds]);

  // Send message to Eco Buddy backend endpoint (/api/chat)
  const handleSendMessage = async (text: string, categoryPrompt?: EcoCategory) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build history payload
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Try main /api/chat route first (Cloud Run / Express local server)
      let endpoint = '/api/chat';
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          categoryPrompt,
        }),
      });

      // Fallback for Netlify deployment serverless function path if 404
      if (response.status === 404) {
        endpoint = '/.netlify/functions/chat';
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyPayload,
            categoryPrompt,
          }),
        });
      }

      if (!response.ok) {
        let serverErrDetail = `Server returned HTTP ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error) serverErrDetail = errData.error;
          if (errData?.details) serverErrDetail += ` (${errData.details})`;
        } catch {
          // ignore json parse error
        }
        throw new Error(serverErrDetail);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to help you with your eco goals!',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage = err?.message || 'Connection issue with AI service.';
      const fallbackMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Notice**: ${errorMessage}

🌱 **Quick Eco Tips in the Meantime**:
- **Water**: Turn off the tap while brushing to save ~4 gallons/min.
- **Energy**: Wash clothes in cold water to reduce washing machine energy by up to 90%.
- **Recycling**: Rinse containers clean before placing them in recycling bins.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAiAboutTip = (tip: EcoTip) => {
    setActiveTab('chat');
    handleSendMessage(`How can I easily implement this eco tip in my daily routine: "${tip.title}" - ${tip.description}?`);
  };

  const handleAskAiGeneral = (promptText: string) => {
    setActiveTab('chat');
    handleSendMessage(promptText);
  };

  const handleToggleSaveTip = (tipId: string) => {
    setSavedTipIds((prev) =>
      prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId]
    );
  };

  const handleAwardPoints = (points: number) => {
    setUserPoints((prev) => prev + points);
  };

  const handleIncrementStreak = () => {
    setStreakDays((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] dark:bg-[#0B160E] text-[#1B3022] dark:text-[#F7F8F3] font-sans selection:bg-[#A7C957] selection:text-[#1B3022] transition-colors duration-300">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPoints={userPoints}
        streakDays={streakDays}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Render Views Based on Active Tab */}
        {activeTab === 'chat' && (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onSelectCategoryTopic={(cat) => handleSendMessage(`Give me practical ${cat} eco tips.`, cat)}
          />
        )}

        {activeTab === 'tip' && (
          <DailyTipCard
            onAskChatAboutTip={handleAskAiAboutTip}
            savedTipIds={savedTipIds}
            onToggleSaveTip={handleToggleSaveTip}
          />
        )}

        {activeTab === 'energy-water' && (
          <EnergyWaterCalculatorComponent onAskAiWithAudit={handleAskAiGeneral} />
        )}

        {activeTab === 'recycling' && (
          <RecyclingGuideComponent onAskAi={handleAskAiGeneral} />
        )}

        {activeTab === 'transport' && (
          <TransportCalculatorComponent onAskAi={handleAskAiGeneral} />
        )}

        {activeTab === 'challenge' && (
          <WeeklyChallengeComponent
            onAwardPoints={handleAwardPoints}
            onIncrementStreak={handleIncrementStreak}
          />
        )}

        {/* Secondary Did You Know facts section when on Tip tab */}
        {activeTab === 'tip' && (
          <div className="mt-10">
            <FactCardComponent onAskAiAboutFact={handleAskAiGeneral} />
          </div>
        )}
      </main>

      {/* Export to GitHub & Host on Netlify Modal */}
      <ExportNetlifyModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
