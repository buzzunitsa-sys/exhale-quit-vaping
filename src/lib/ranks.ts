import { Sparkles, Shield, Zap, Crown, Star, Medal, Award, Flame } from 'lucide-react';
import React from 'react';
export interface Rank {
  id: string;
  title: string;
  minHours: number;
  icon: React.ElementType;
  color: string;
  description: string;
}
export const RANKS: Rank[] = [
  {
    id: 'initiate',
    title: 'Initiate',
    minHours: 0,
    icon: Sparkles,
    color: 'text-slate-400',
    description: 'The journey of a thousand miles begins with a single step.'
  },
  {
    id: 'novice',
    title: 'Novice',
    minHours: 24,
    icon: Flame,
    color: 'text-orange-400',
    description: 'First 24 hours conquered. The fire is lit.'
  },
  {
    id: 'apprentice',
    title: 'Apprentice',
    minHours: 72,
    icon: Zap,
    color: 'text-yellow-400',
    description: 'Three days clean. The physical grip is loosening.'
  },
  {
    id: 'warrior',
    title: 'Warrior',
    minHours: 168, // 1 week
    icon: Shield,
    color: 'text-emerald-400',
    description: 'One week of battles won. You are stronger than you know.'
  },
  {
    id: 'guardian',
    title: 'Guardian',
    minHours: 336, // 2 weeks
    icon: Medal,
    color: 'text-sky-400',
    description: 'Two weeks. You are protecting your future self.'
  },
  {
    id: 'master',
    title: 'Master',
    minHours: 720, // 30 days
    icon: Star,
    color: 'text-violet-400',
    description: 'One month. You have mastered the first major milestone.'
  },
  {
    id: 'grandmaster',
    title: 'Grandmaster',
    minHours: 2160, // 90 days
    icon: Award,
    color: 'text-pink-400',
    description: 'Three months. A new lifestyle is forged.'
  },
  {
    id: 'legend',
    title: 'Legend',
    minHours: 8760, // 1 year
    icon: Crown,
    color: 'text-amber-400',
    description: 'One year. Your achievement is legendary.'
  }
];
export function getUserRank(hoursFree: number): { current: Rank; next: Rank | null; progress: number } {
  let current = RANKS[0];
  let next: Rank | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (hoursFree >= RANKS[i].minHours) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    } else {
      break;
    }
  }
  let progress = 0;
  if (next) {
    const totalRange = next.minHours - current.minHours;
    const elapsedInRank = hoursFree - current.minHours;
    progress = Math.min(100, Math.max(0, (elapsedInRank / totalRange) * 100));
  } else {
    progress = 100; // Max rank achieved
  }
  return { current, next, progress };
}