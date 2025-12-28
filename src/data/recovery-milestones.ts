import { Heart, Wind, Activity, Brain, Smile, Zap, Shield, Timer } from 'lucide-react';
import React from 'react';
export interface RecoveryMilestone {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  icon: React.ElementType;
}
export const RECOVERY_MILESTONES: RecoveryMilestone[] = [
  {
    id: '20m',
    title: 'Pulse Rate Drops',
    description: 'Your heart rate and blood pressure drop back to normal levels.',
    durationSeconds: 20 * 60,
    icon: Activity,
  },
  {
    id: '8h',
    title: 'Oxygen Levels Normal',
    description: 'Carbon monoxide levels in your blood drop to normal. Oxygen levels increase.',
    durationSeconds: 8 * 60 * 60,
    icon: Wind,
  },
  {
    id: '24h',
    title: 'Heart Attack Risk',
    description: 'Your risk of heart attack begins to decrease significantly.',
    durationSeconds: 24 * 60 * 60,
    icon: Heart,
  },
  {
    id: '48h',
    title: 'Senses Return',
    description: 'Nerve endings start to regrow. Your sense of smell and taste improve.',
    durationSeconds: 48 * 60 * 60,
    icon: Smile,
  },
  {
    id: '72h',
    title: 'Nicotine Free',
    description: 'Your body is 100% nicotine-free. Withdrawal symptoms peak then decline.',
    durationSeconds: 72 * 60 * 60,
    icon: Zap,
  },
  {
    id: '2w',
    title: 'Circulation Improves',
    description: 'Blood circulation improves, making physical activity easier.',
    durationSeconds: 14 * 24 * 60 * 60,
    icon: Activity,
  },
  {
    id: '1m',
    title: 'Lungs Repair',
    description: 'Cilia (tiny hair-like structures) in lungs start to regain normal function.',
    durationSeconds: 30 * 24 * 60 * 60,
    icon: Wind,
  },
  {
    id: '3m',
    title: 'Energy Boost',
    description: 'Lung function has increased by up to 10%. Coughing and wheezing decrease.',
    durationSeconds: 90 * 24 * 60 * 60,
    icon: Zap,
  },
  {
    id: '1y',
    title: 'Heart Health',
    description: 'Risk of coronary heart disease is half that of a smoker.',
    durationSeconds: 365 * 24 * 60 * 60,
    icon: Heart,
  },
  {
    id: '5y',
    title: 'Stroke Risk',
    description: 'Risk of stroke is reduced to that of a non-smoker.',
    durationSeconds: 5 * 365 * 24 * 60 * 60,
    icon: Brain,
  },
  {
    id: '10y',
    title: 'Long Term Health',
    description: 'Risk of lung cancer falls to about half that of a smoker.',
    durationSeconds: 10 * 365 * 24 * 60 * 60,
    icon: Shield,
  },
];