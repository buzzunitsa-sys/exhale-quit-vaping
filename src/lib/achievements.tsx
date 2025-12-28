import React from 'react';
import { Star, Zap, Shield, Target, Award, Crown, Scale, Clock, Heart, CheckCircle2, Wind, Medal, Flag } from 'lucide-react';
import type { Achievement, JournalEntry } from '@/types/app';
export const ACHIEVEMENTS: Achievement[] = [
  // Initial Milestone
  {
    id: 'commitment',
    title: 'The Journey Begins',
    description: 'Take the first step by creating your profile and starting your timer.',
    type: 'time',
    icon: <Flag className="w-6 h-6" />,
    condition: () => true, // Always unlocked once the user exists
  },
  // Time Based
  {
    id: '12hours',
    title: 'First Night',
    description: 'Stay smoke-free for 12 hours.',
    type: 'time',
    icon: <Clock className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 12 * 60 * 60,
  },
  {
    id: '1day',
    title: 'First Step',
    description: 'Complete 24 hours without vaping.',
    type: 'time',
    icon: <Star className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 24 * 60 * 60,
  },
  {
    id: '48hours',
    title: 'Double Down',
    description: 'Reach 48 hours smoke-free.',
    type: 'time',
    icon: <Zap className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 48 * 60 * 60,
  },
  {
    id: '3days',
    title: 'Chemical Free',
    description: 'Pass the 3-day mark (72 hours) to clear nicotine from your body.',
    type: 'health',
    icon: <Heart className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 3 * 24 * 60 * 60,
  },
  {
    id: '1week',
    title: 'Week Warrior',
    description: 'Achieve one full week of freedom.',
    type: 'time',
    icon: <Shield className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 7 * 24 * 60 * 60,
  },
  {
    id: '2weeks',
    title: 'Fortitude',
    description: 'Stay strong for two consecutive weeks.',
    type: 'time',
    icon: <Shield className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 14 * 24 * 60 * 60,
  },
  {
    id: '1month',
    title: 'Master of Self',
    description: 'Complete one full month smoke-free.',
    type: 'time',
    icon: <Crown className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 30 * 24 * 60 * 60,
  },
  {
    id: '3months',
    title: 'Quarter Year',
    description: 'Reach 3 months (90 days) of clean lungs.',
    type: 'time',
    icon: <Award className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 90 * 24 * 60 * 60,
  },
  {
    id: '6months',
    title: 'Half Marathon',
    description: 'Stay smoke-free for 6 months.',
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
    description: 'Save your first $20 by not buying vapes.',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 20,
  },
  {
    id: 'save50',
    title: 'Dinner on Us',
    description: 'Save a total of $50.',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 50,
  },
  {
    id: 'save100',
    title: 'Baller',
    description: 'Reach $100 in savings.',
    type: 'money',
    icon: <Award className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 100,
  },
  {
    id: 'save250',
    title: 'Investment',
    description: 'Save $250.',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 250,
  },
  {
    id: 'save500',
    title: 'Big Spender',
    description: 'Save $500.',
    type: 'money',
    icon: <Award className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 500,
  },
  {
    id: 'save1000',
    title: 'Grand Savings',
    description: 'Save $1,000.',
    type: 'money',
    icon: <Crown className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 1000,
  },
  // Usage & Habits
  {
    id: 'taper',
    title: 'Taper Master',
    description: 'Stay under your daily limit for a full day.',
    type: 'health',
    icon: <Scale className="w-6 h-6" />,
    condition: ({ dailyLimit, puffsToday }) => (dailyLimit ?? 0) > 0 && (puffsToday ?? 0) <= (dailyLimit ?? 0),
  },
  {
    id: 'pods1',
    title: 'Pod Skipper',
    description: 'Avoid the equivalent of 1 full pod or disposable.',
    type: 'health',
    icon: <CheckCircle2 className="w-6 h-6" />,
    condition: ({ podsAvoided }) => podsAvoided >= 1,
  },
  {
    id: 'pods5',
    title: 'Pack Saver',
    description: 'Avoid 5 pods/disposables.',
    type: 'health',
    icon: <CheckCircle2 className="w-6 h-6" />,
    condition: ({ podsAvoided }) => podsAvoided >= 5,
  },
  {
    id: 'pods10',
    title: 'Bulk Avoider',
    description: 'Avoid 10 pods/disposables.',
    type: 'health',
    icon: <CheckCircle2 className="w-6 h-6" />,
    condition: ({ podsAvoided }) => podsAvoided >= 10,
  },
  {
    id: 'breathe',
    title: 'Just Breathe',
    description: 'Complete an SOS breathing exercise session.',
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