import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, ShieldCheck, Droplet, Zap, Bike, Flame, Award, Sparkles } from 'lucide-react';
import { WeeklyChallenge } from '../types';
import { INITIAL_CHALLENGES } from '../data/ecoContent';

interface WeeklyChallengeProps {
  onAwardPoints: (points: number) => void;
  onIncrementStreak: () => void;
}

export const WeeklyChallengeComponent: React.FC<WeeklyChallengeProps> = ({
  onAwardPoints,
  onIncrementStreak,
}) => {
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>(INITIAL_CHALLENGES);

  const toggleDayCheck = (challengeId: string, dayIndex: number) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== challengeId) return c;

        const newDays = [...c.completedDays];
        newDays[dayIndex] = !newDays[dayIndex];
        const isNowComplete = newDays.every(Boolean);

        // If newly completed, trigger confetti!
        if (isNowComplete && !c.isCompleted) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          onAwardPoints(c.points);
          onIncrementStreak();
        }

        return {
          ...c,
          completedDays: newDays,
          isCompleted: isNowComplete,
        };
      })
    );
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Droplet':
        return Droplet;
      case 'Zap':
        return Zap;
      case 'Bike':
        return Bike;
      default:
        return Trophy;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header Banner */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[32px] p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A7C957]">
            Weekly Green Challenges
          </span>
          <h2 className="editorial-serif text-3xl sm:text-4xl font-light italic text-[#F7F8F3] leading-tight">
            Build Long-Term Eco Habits
          </h2>
          <p className="text-xs sm:text-sm text-[#F7F8F3]/80 max-w-xl leading-relaxed">
            Check off daily eco missions to earn eco-points, unlock achievements, and maintain your green streak!
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-full border border-white/10 flex-shrink-0 z-10">
          <Award className="w-6 h-6 text-[#A7C957]" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F7F8F3]/70">Unlocked Badges</div>
            <div className="editorial-serif italic text-xl font-bold text-[#F7F8F3]">
              {challenges.filter((c) => c.isCompleted).length} / {challenges.length} Complete
            </div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 gap-6">
        {challenges.map((chal) => {
          const IconComponent = getBadgeIcon(chal.badgeIcon);
          const completedCount = chal.completedDays.filter(Boolean).length;
          const progressPercent = Math.round((completedCount / chal.totalDays) * 100);

          return (
            <div
              key={chal.id}
              className={`bg-white rounded-[24px] p-6 border transition-all shadow-xs ${
                chal.isCompleted
                  ? 'border-[#A7C957] bg-[#E8EDE0]/20'
                  : 'border-[#1B3022]/10 hover:border-[#1B3022]/30'
              }`}
            >
              {/* Challenge Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-2xs ${
                      chal.isCompleted
                        ? 'bg-[#1B3022] text-[#A7C957]'
                        : 'bg-[#E8EDE0] text-[#1B3022]'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="editorial-serif text-2xl font-normal italic text-[#1B3022]">{chal.title}</h3>
                      {chal.isCompleted && (
                        <span className="bg-[#A7C957] text-[#1B3022] border border-[#1B3022]/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#1B3022]" /> Earned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#1B3022]/70 mt-1">{chal.shortDesc}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B3022] bg-[#A7C957]/30 border border-[#1B3022]/10 px-3 py-1 rounded-full">
                    +{chal.points} Eco Pts
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1B3022]/80">
                  <span className="text-[11px] uppercase tracking-wider font-bold">Progress ({completedCount}/7 Days)</span>
                  <span className="editorial-serif italic text-sm">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#E8EDE0] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1B3022] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* 7-Day Checkboxes */}
              <div className="mt-5 pt-4 border-t border-[#1B3022]/10">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
                    const checked = chal.completedDays[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleDayCheck(chal.id, idx)}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition ${
                          checked
                            ? 'bg-[#1B3022] text-[#F7F8F3] border-[#1B3022]'
                            : 'bg-[#F7F8F3] text-[#1B3022]/70 border-[#1B3022]/10 hover:bg-[#E8EDE0]'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{dayName}</span>
                        <div className="mt-1">
                          {checked ? (
                            <CheckCircle2 className="w-4 h-4 text-[#A7C957]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#1B3022]/30"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

