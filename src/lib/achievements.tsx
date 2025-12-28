import React from 'react';
import { Star, Zap, Shield, Target, Award, Crown, Scale, Clock, Heart, CheckCircle2, Wind, Medal } from 'lucide-react';
import type { Achievement, JournalEntry } from '@/types/app';
export const ACHIEVEMENTS: Achievement[] = [
  // Time Based
  {
    id: '12hours',
    title: 'First Night',
    description: '12 hours smoke-free',
    type: 'time',
    icon: <Clock className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 12 * 60 * 60,
  },
  {
    id: '1day',
    title: 'First Step',
    description: 'Stay smoke-free for 24 hours',
    type: 'time',
    icon: <Star className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 24 * 60 * 60,
  },
  {
    id: '48hours',
    title: 'Double Down',
    description: '48 hours without nicotine',
    type: 'time',
    icon: <Zap className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 48 * 60 * 60,
  },
  {
    id: '3days',
    title: 'Chemical Free',
    description: '3 days - Nicotine is leaving your system',
    type: 'health',
    icon: <Heart className="w-6 h-6" />,
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
    id: '2weeks',
    title: 'Fortitude',
    description: 'Two weeks strong',
    type: 'time',
    icon: <Shield className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 14 * 24 * 60 * 60,
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
    id: '3months',
    title: 'Quarter Year',
    description: '3 months of clean lungs',
    type: 'time',
    icon: <Award className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 90 * 24 * 60 * 60,
  },
  {
    id: '6months',
    title: 'Half Marathon',
    description: '6 months smoke-free',
    type: 'time',
    icon: <Medal className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 180 * 24 * 60 * 60,
  },
  {
    id: '1year',
    title: 'Legendary',
    description: 'One full year. You are free.',
    type: 'time',
    icon: <Crown className="w-6 h-6 text-yellow-500" />,
    condition: ({ secondsFree }) => secondsFree >= 365 * 24 * 60 * 60,
  },
  // Money Based
  {
    id: 'save20',
    title: 'Pocket Change',
    description: 'Save your first $20',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 20,
  },
  {
    id: 'save50',
    title: 'Dinner on Us',
    description: 'Save $50',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 50,
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
    id: 'save250',
    title: 'Investment',
    description: 'Save $250',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 250,
  },
  {
    id: 'save500',
    title: 'Big Spender',
    description: 'Save $500',
    type: 'money',
    icon: <Award className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 500,
  },
  {
    id: 'save1000',
    title: 'Grand Savings',
    description: 'Save $1,000',
    type: 'money',
    icon: <Crown className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 1000,
  },
  // Usage & Habits
  {
    id: 'taper',
    title: 'Taper Master',
    description: 'Stay under your daily limit today',
    type: 'health',
    icon: <Scale className="w-6 h-6" />,
    condition: ({ dailyLimit, puffsToday }) => (dailyLimit ?? 0) > 0 && (puffsToday ?? 0) <= (dailyLimit ?? 0),
  },
  {
    id: 'pods1',
    title: 'Pod Skipper',
    description: 'Avoided 1 full pod/disposable',
    type: 'health',
    icon: <CheckCircle2 className="w-6 h-6" />,
    condition: ({ podsAvoided }) => podsAvoided >= 1,
  },
  {
    id: 'pods5',
    title: 'Pack Saver',
    description: 'Avoided 5 pods/disposables',
    type: 'health',
    icon: <CheckCircle2 className="w-6 h-6" />,
    condition: ({ podsAvoided }) => podsAvoided >= 5,
  },
  {
    id: 'pods10',
    title: 'Bulk Avoider',
    description: 'Avoided 10 pods/disposables',
    type: 'health',
    icon: <CheckCircle2 className="w-6 h-6" />,
    condition: ({ podsAvoided }) => podsAvoided >= 10,
  },
  {
    id: 'breathe',
    title: 'Just Breathe',
    description: 'Completed an SOS breathing exercise',
    type: 'health',
    icon: <Wind className="w-6 h-6" />,
    condition: ({ journal }) => {
      return journal?.some(entry => entry.trigger === "Breathing Exercise") ?? false;
    },
  }
];
export function getUnlockedAchievements(stats: {
  secondsFree: number;
  moneySaved: number;
  podsAvoided: number;
  dailyLimit?: number;
  puffsToday?: number;
  journal?: JournalEntry[];
}): string[] {
  return ACHIEVEMENTS.filter(a => a.condition(stats)).map(a => a.id);
}