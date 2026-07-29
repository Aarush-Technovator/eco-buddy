import React, { useState } from 'react';
import { Bike, Car, Bus, Footprints, Zap, Sparkles, Send, ArrowRight } from 'lucide-react';
import { TRANSPORT_MODES } from '../data/ecoContent';

interface TransportCalculatorProps {
  onAskAi: (prompt: string) => void;
}

export const TransportCalculatorComponent: React.FC<TransportCalculatorProps> = ({ onAskAi }) => {
  const [dailyKm, setDailyKm] = useState<number>(12); // Default 12 km round-trip
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);

  const annualKm = dailyKm * daysPerWeek * 50; // 50 weeks per year

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return Car;
      case 'Zap':
        return Zap;
      case 'Bus':
        return Bus;
      case 'Bike':
        return Bike;
      case 'Footprints':
        return Footprints;
      default:
        return Car;
    }
  };

  const handleAskCommuteAdvice = () => {
    const prompt = `I commute approximately ${dailyKm} km per day, ${daysPerWeek} days a week (annual distance ~${annualKm} km).
I want to lower my commuting carbon footprint and save money.
What are the best multi-modal transit options (e.g., hybrid bike+bus, e-bike, carpool) and eco habits I can try?`;

    onAskAi(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex items-center space-x-3 z-10 relative">
          <div className="p-2.5 bg-white/10 rounded-full backdrop-blur-md">
            <Bike className="w-6 h-6 text-[#A7C957]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A7C957]">
              Transport & Mobility
            </span>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-light italic text-[#F7F8F3]">
              Commute Carbon Calculator
            </h2>
          </div>
        </div>
      </div>

      {/* Commute Inputs */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#1B3022]/10 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Daily Distance Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#1B3022]">Daily Round-trip Commute</label>
              <span className="font-bold text-[#1B3022] bg-[#E8EDE0] px-3 py-1 rounded-full border border-[#1B3022]/10">
                {dailyKm} km / day (~{(dailyKm * 0.621).toFixed(1)} mi)
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-[#1B3022] cursor-pointer"
            />
          </div>

          {/* Days Per Week Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#1B3022]">Commute Days per Week</label>
              <span className="font-bold text-[#1B3022] bg-[#E8EDE0] px-3 py-1 rounded-full border border-[#1B3022]/10">
                {daysPerWeek} Days / week
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full accent-[#1B3022] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Modes Comparison Table / Cards */}
      <div className="space-y-4">
        <h3 className="editorial-serif text-2xl font-normal italic text-[#1B3022] flex items-center justify-between">
          <span>Transit Mode Comparison ({annualKm.toLocaleString()} km/year)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRANSPORT_MODES.map((mode) => {
            const IconComponent = getIcon(mode.iconName);

            // Annual math:
            const modeCo2Kg = Math.round((mode.co2GramsPerKm * annualKm) / 1000);
            const modeCostUSD = Math.round(mode.costPerKmUSD * annualKm);
            const modeCalories = Math.round(mode.caloriesBurnedPerKm * annualKm);

            // Max car co2 for bar chart relative scaling
            const maxCarCo2 = (192 * annualKm) / 1000 || 1;
            const barWidthPercent = Math.max(5, Math.round((modeCo2Kg / maxCarCo2) * 100));

            const isClean = mode.co2GramsPerKm === 0;

            return (
              <div
                key={mode.id}
                className={`bg-white rounded-[24px] p-6 border shadow-2xs space-y-4 flex flex-col justify-between ${
                  isClean ? 'border-[#A7C957] bg-[#E8EDE0]/20' : 'border-[#1B3022]/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-full text-white ${isClean ? 'bg-[#1B3022]' : 'bg-[#1B3022]/70'}`}>
                        <IconComponent className="w-5 h-5 text-[#A7C957]" />
                      </div>
                      <div>
                        <h4 className="editorial-serif text-2xl font-normal italic text-[#1B3022]">{mode.name}</h4>
                        <p className="text-[11px] text-[#1B3022]/60">{mode.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Emission Bar */}
                  <div className="space-y-1.5 my-4">
                    <div className="flex justify-between text-[11px] font-semibold text-[#1B3022]/70">
                      <span className="uppercase tracking-wider font-bold text-[10px]">Annual CO2</span>
                      <span className={isClean ? 'text-[#6A994E] font-bold' : 'text-[#1B3022] font-bold'}>
                        {modeCo2Kg.toLocaleString()} kg CO2
                      </span>
                    </div>
                    <div className="w-full bg-[#E8EDE0] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isClean ? 'bg-[#6A994E]' : modeCo2Kg > 1000 ? 'bg-rose-600' : 'bg-amber-600'
                        }`}
                        style={{ width: `${barWidthPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs pt-2">
                    <div className="bg-[#F7F8F3] p-3 rounded-[16px] border border-[#1B3022]/10">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#1B3022]/50">Est. Cost</div>
                      <div className="editorial-serif italic text-lg text-[#1B3022]">${modeCostUSD.toLocaleString()} / yr</div>
                    </div>

                    <div className="bg-[#F7F8F3] p-3 rounded-[16px] border border-[#1B3022]/10">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#1B3022]/50">Calories</div>
                      <div className="editorial-serif italic text-lg text-[#1B3022]">{modeCalories.toLocaleString()} kcal</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAskAi(`How can I safely switch my ${dailyKm}km commute from driving to ${mode.name}? Give me route planning and gear advice.`)}
                  className="w-full text-[10px] uppercase tracking-wider font-bold text-[#1B3022] hover:text-[#F7F8F3] bg-[#E8EDE0] hover:bg-[#1B3022] p-3 rounded-full transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Inquire About {mode.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Commute Advice Banner */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[24px] p-6 border border-[#1B3022]/10 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="editorial-serif text-2xl font-light italic text-[#F7F8F3] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A7C957]" /> Customized Commute Optimization Plan
          </h4>
          <p className="text-xs text-[#F7F8F3]/80">
            EcoBuddy AI can recommend e-bike routes, carpool strategies, and multi-modal transit options tailored to your distance.
          </p>
        </div>

        <button
          onClick={handleAskCommuteAdvice}
          className="bg-[#A7C957] hover:bg-white text-[#1B3022] font-bold px-5 py-3 rounded-full text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
        >
          <span>Optimize My Commute</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

