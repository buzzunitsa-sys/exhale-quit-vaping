import React from 'react';
import { Star, Zap, Shield, Target, Award, Crown, Scale } from 'lucide-react';
import type { Achievement } from '@/types/app';
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1day',
    title: 'First Step',
    description: 'Stay smoke-free for 24 hours',
    type: 'time',
    icon: <Star className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 24 * 60 * 60,
  },
  {
    id: '3days',
    title: 'Chemical Free',
    description: '3 days without nicotine',
    type: 'health',
    icon: <Zap className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 3 * 24 * 60 * 60,
  },
  {
    id: '1week',
    title: 'Week Warrior',
    description: 'One full week of freedom',
    type: 'time',
    icon: <Shield className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 7 * 24 * 60 * 60,
  },
  {
    id: 'save20',
    title: 'Pocket Change',
    description: 'Save your first $20',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 20,
  },
  {
    id: 'save100',
    title: 'Baller',
    description: 'Save $100 not buying vapes',
    type: 'money',
    icon: <Award className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 100,
  },
  {
    id: '1month',
    title: 'Master of Self',
    description: 'One month smoke-free',
    type: 'time',
    icon: <Crown className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 30 * 24 * 60 * 60,
  },
  {
    id: 'taper',
    title: 'Taper Master',
    description: 'Stay under your daily limit today',
    type: 'health',
    icon: <Scale className="w-6 h-6" />,
    condition: ({ dailyLimit, puffsToday }) => (dailyLimit ?? 0) > 0 && (puffsToday ?? 0) <= (dailyLimit ?? 0),
  },
];
export function getUnlockedAchievements(stats: {
  secondsFree: number;
  moneySaved: number;
  podsAvoided: number;
  dailyLimit?: number;
  puffsToday?: number;
}): string[] {
  return ACHIEVEMENTS.filter(a => a.condition(stats)).map(a => a.id);
}