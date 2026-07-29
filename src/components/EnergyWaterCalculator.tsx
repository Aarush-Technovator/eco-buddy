import React, { useState } from 'react';
import { Zap, Droplet, DollarSign, Leaf, Sparkles, Send, RefreshCw } from 'lucide-react';

interface EnergyWaterCalculatorProps {
  onAskAiWithAudit: (prompt: string) => void;
}

export const EnergyWaterCalculatorComponent: React.FC<EnergyWaterCalculatorProps> = ({
  onAskAiWithAudit,
}) => {
  // Habit sliders & state
  const [showerMinutes, setShowerMinutes] = useState<number>(10);
  const [washTemp, setWashTemp] = useState<'hot' | 'warm' | 'cold'>('warm');
  const [unplugPhantom, setUnplugPhantom] = useState<boolean>(false);
  const [ledPercentage, setLedPercentage] = useState<number>(30);
  const [thermostatEco, setThermostatEco] = useState<boolean>(false);

  // Math calculations
  const waterSavedShowerGal = Math.max(0, (10 - showerMinutes) * 2.5 * 365);
  const washEnergyKwh = washTemp === 'cold' ? 450 : washTemp === 'warm' ? 200 : 0;
  const phantomKwh = unplugPhantom ? 350 : 0;
  const ledKwh = Math.round((ledPercentage / 100) * 400);
  const thermoKwh = thermostatEco ? 500 : 0;

  const totalKwhSaved = washEnergyKwh + phantomKwh + ledKwh + thermoKwh;
  const totalWaterSaved = Math.round(waterSavedShowerGal);

  const dollarsSaved = Math.round(totalKwhSaved * 0.16 + totalWaterSaved * 0.008);
  const co2SavedKg = Math.round(totalKwhSaved * 0.385 + totalWaterSaved * 0.001);

  const handleGenerateCustomAudit = () => {
    const prompt = `Here is my home energy & water audit profile:
- Shower length: ${showerMinutes} minutes per day
- Laundry wash temperature: ${washTemp}
- Unplugging phantom loads at night: ${unplugPhantom ? 'Yes' : 'No'}
- LED bulb coverage: ${ledPercentage}%
- Thermostat eco setback (2° lower/higher): ${thermostatEco ? 'Yes' : 'No'}

Based on this data, I am currently saving estimated ${totalWaterSaved} gallons of water and ${totalKwhSaved} kWh of electricity ($${dollarsSaved}/yr).
What are the next top 3 highest-leverage actions I can take to increase my savings further?`;

    onAskAiWithAudit(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[32px] p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex items-center space-x-3 z-10 relative">
          <div className="p-2.5 bg-white/10 rounded-full backdrop-blur-md">
            <Zap className="w-6 h-6 text-[#A7C957]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A7C957]">
              Home Audit & Calculator
            </span>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-light italic text-[#F7F8F3]">
              Water & Energy Audit
            </h2>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column (2 cols wide) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#122217] rounded-[24px] p-6 sm:p-8 border border-[#1B3022]/10 dark:border-white/10 shadow-2xs space-y-6">
          <h3 className="editorial-serif text-2xl font-normal italic text-[#1B3022] dark:text-[#F7F8F3] border-b border-[#1B3022]/10 dark:border-white/10 pb-3 flex items-center justify-between">
            <span>Household Daily Habits</span>
            <span className="text-xs text-[#6A994E] dark:text-[#A7C957] font-bold uppercase tracking-wider not-italic">Interactive Audit</span>
          </h3>

          {/* 1. Shower Minutes Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#1B3022] dark:text-[#F7F8F3] flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#6A994E] dark:text-[#A7C957]" />
                Daily Shower Duration
              </label>
              <span className="font-bold text-[#1B3022] dark:text-[#F7F8F3] bg-[#E8EDE0] dark:bg-white/10 px-3 py-1 rounded-full border border-[#1B3022]/10 dark:border-white/10">
                {showerMinutes} Minutes
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              value={showerMinutes}
              onChange={(e) => setShowerMinutes(Number(e.target.value))}
              className="w-full accent-[#1B3022] dark:accent-[#A7C957] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#1B3022]/50 dark:text-[#F7F8F3]/50 font-semibold uppercase tracking-wider">
              <span>3 min (Eco)</span>
              <span>10 min (Avg)</span>
              <span>20 min (High)</span>
            </div>
          </div>

          {/* 2. Laundry Temperature */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#1B3022] dark:text-[#F7F8F3] block">
              Laundry Wash Water Temperature
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['cold', 'warm', 'hot'] as const).map((temp) => (
                <button
                  key={temp}
                  onClick={() => setWashTemp(temp)}
                  className={`py-2.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition border cursor-pointer ${
                    washTemp === temp
                      ? 'bg-[#1B3022] dark:bg-[#A7C957] text-[#F7F8F3] dark:text-[#1B3022] border-[#1B3022] dark:border-[#A7C957]'
                      : 'bg-[#F7F8F3] dark:bg-white/10 text-[#1B3022]/70 dark:text-[#F7F8F3]/70 border-[#1B3022]/10 dark:border-white/10 hover:bg-[#E8EDE0] dark:hover:bg-white/20'
                  }`}
                >
                  {temp} Wash
                </button>
              ))}
            </div>
          </div>

          {/* 3. Phantom Power Load Unplugging */}
          <div className="flex items-center justify-between p-4 bg-[#F7F8F3] dark:bg-white/5 rounded-[20px] border border-[#1B3022]/10 dark:border-white/10">
            <div>
              <span className="text-xs font-bold text-[#1B3022] dark:text-[#F7F8F3] block">Unplug Electronics Nightly</span>
              <span className="text-[11px] text-[#1B3022]/60 dark:text-[#F7F8F3]/60">Stops phantom vampire draw from devices</span>
            </div>
            <button
              onClick={() => setUnplugPhantom(!unplugPhantom)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                unplugPhantom
                  ? 'bg-[#1B3022] dark:bg-[#A7C957] text-[#A7C957] dark:text-[#1B3022]'
                  : 'bg-[#E8EDE0] dark:bg-white/10 text-[#1B3022]/60 dark:text-[#F7F8F3]/60 hover:bg-[#1B3022]/10 dark:hover:bg-white/20'
              }`}
            >
              {unplugPhantom ? 'Active' : 'Off'}
            </button>
          </div>

          {/* 4. LED Lighting Percentage */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#1B3022] dark:text-[#F7F8F3]">Percentage of LED Bulbs in Home</label>
              <span className="font-bold text-[#1B3022] dark:text-[#F7F8F3] bg-[#E8EDE0] dark:bg-white/10 px-3 py-1 rounded-full border border-[#1B3022]/10 dark:border-white/10">
                {ledPercentage}% LEDs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={ledPercentage}
              onChange={(e) => setLedPercentage(Number(e.target.value))}
              className="w-full accent-[#1B3022] dark:accent-[#A7C957] cursor-pointer"
            />
          </div>

          {/* 5. Thermostat Eco Setback */}
          <div className="flex items-center justify-between p-4 bg-[#F7F8F3] dark:bg-white/5 rounded-[20px] border border-[#1B3022]/10 dark:border-white/10">
            <div>
              <span className="text-xs font-bold text-[#1B3022] dark:text-[#F7F8F3] block">Smart Thermostat Eco Setback (2° Adj.)</span>
              <span className="text-[11px] text-[#1B3022]/60 dark:text-[#F7F8F3]/60">Adjust thermostat 2° cooler in winter / warmer in summer</span>
            </div>
            <button
              onClick={() => setThermostatEco(!thermostatEco)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                thermostatEco
                  ? 'bg-[#1B3022] dark:bg-[#A7C957] text-[#A7C957] dark:text-[#1B3022]'
                  : 'bg-[#E8EDE0] dark:bg-white/10 text-[#1B3022]/60 dark:text-[#F7F8F3]/60 hover:bg-[#1B3022]/10 dark:hover:bg-white/20'
              }`}
            >
              {thermostatEco ? 'Active' : 'Off'}
            </button>
          </div>
        </div>

        {/* Real-Time Impact Results Card */}
        <div className="bg-[#1B3022] text-[#F7F8F3] rounded-[24px] p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A7C957]">
              Impact Projection
            </span>
            <h3 className="editorial-serif text-3xl font-light italic text-[#F7F8F3] border-b border-white/10 pb-3">
              Estimated Annual Savings
            </h3>

            {/* Metric Cards */}
            <div className="space-y-3">
              <div className="bg-white/10 p-4 rounded-[18px] backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#A7C957]/20 text-[#A7C957] rounded-full">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#F7F8F3]/70">Utility Bill Savings</div>
                    <div className="editorial-serif italic text-2xl font-light text-[#A7C957]">${dollarsSaved} / yr</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-[18px] backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-500/20 text-sky-300 rounded-full">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#F7F8F3]/70">Water Conserved</div>
                    <div className="editorial-serif italic text-2xl font-light text-sky-200">{totalWaterSaved.toLocaleString()} Gal</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-[18px] backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/20 text-amber-300 rounded-full">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#F7F8F3]/70">Electricity Saved</div>
                    <div className="editorial-serif italic text-2xl font-light text-amber-200">{totalKwhSaved.toLocaleString()} kWh</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-[18px] backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#A7C957]/20 text-[#A7C957] rounded-full">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#F7F8F3]/70">CO2 Footprint Cut</div>
                    <div className="editorial-serif italic text-2xl font-light text-[#A7C957]">{co2SavedKg.toLocaleString()} kg CO2e</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trigger AI Audit Button */}
          <button
            onClick={handleGenerateCustomAudit}
            className="w-full bg-[#A7C957] hover:bg-white text-[#1B3022] font-bold py-3.5 px-4 rounded-full text-xs transition-colors flex items-center justify-center space-x-2 uppercase tracking-widest text-[10px]"
          >
            <Sparkles className="w-4 h-4 text-[#1B3022]" />
            <span>Get AI Energy Optimization Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

