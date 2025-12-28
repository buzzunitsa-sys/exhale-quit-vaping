import type { User, QuitProfile } from '@shared/types';
export type { User, QuitProfile };
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