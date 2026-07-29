export type EcoCategory = 
  | 'all'
  | 'water'
  | 'electricity'
  | 'recycling'
  | 'transport'
  | 'facts'
  | 'challenge'
  | 'general';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: EcoCategory;
  isStreaming?: boolean;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: EcoCategory;
  impact: string;
  difficulty: 'Easy' | 'Medium' | 'Pro';
  co2SavedKg?: number;
  waterSavedGal?: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  shortDesc: string;
  fullDetails: string;
  category: EcoCategory;
  totalDays: number; // usually 7
  completedDays: boolean[]; // array of 7 booleans
  isCompleted: boolean;
  points: number;
  badge: string;
  badgeIcon: string;
}

export interface RecyclingGuideItem {
  id: string;
  name: string;
  category: 'Plastics' | 'Paper & Cardboard' | 'Glass' | 'Metals' | 'E-Waste' | 'Compost' | 'Special Hazardous';
  isRecyclable: boolean;
  recyclingCode?: string;
  instructions: string;
  doNotInclude?: string;
}

export interface TransportComparison {
  id: string;
  name: string;
  co2GramsPerKm: number; // e.g., Car=192, EV=53, Bus=89, Train=41, Bike=0, Walk=0
  costPerKmUSD: number;  // e.g. Car=0.25, Bus=0.10, Bike=0.01
  caloriesBurnedPerKm: number; // e.g. Bike=30, Walk=65, Car=0
  iconName: string;
  description: string;
}

export interface EnvironmentalFact {
  id: string;
  fact: string;
  context: string;
  actionableTip: string;
  category: EcoCategory;
  statNumber: string;
  statLabel: string;
}

export interface UserStats {
  points: number;
  streakDays: number;
  completedChallengesCount: number;
  savedTipsIds: string[];
  co2SavedKgTotal: number;
  waterSavedGalTotal: number;
}
