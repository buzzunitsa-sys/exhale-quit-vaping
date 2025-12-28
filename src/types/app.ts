import type { User, QuitProfile, JournalEntry } from '@shared/types';
export type { User, QuitProfile, JournalEntry };
export interface DashboardStats {
  timeFree: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  };
  moneySaved: number;
  cigarettesAvoided: number;
  healthProgress: number; // 0-100
}
export interface OnboardingStepProps {
  onNext: (data: Partial<QuitProfile>) => void;
  onBack: () => void;
  initialData: Partial<QuitProfile>;
}
export interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  icon: React.ReactNode;
}
export type AchievementType = 'time' | 'money' | 'health';
export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (stats: {
    secondsFree: number;
    moneySaved: number;
    podsAvoided: number;
    dailyLimit?: number;
    puffsToday?: number;
    journal?: JournalEntry[];
  }) => boolean;
  icon: React.ReactNode;
  type: AchievementType;
}