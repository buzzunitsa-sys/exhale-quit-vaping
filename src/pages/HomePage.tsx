import React from 'react';
import { useAppStore } from '@/lib/store';
import { DashboardPage } from './DashboardPage';
import { OnboardingPage } from './OnboardingPage';
import { MobileLayout } from '@/components/layout/MobileLayout';
export function HomePage() {
  const user = useAppStore(s => s.user);
  // If user is logged in AND has a profile, show dashboard
  if (user?.profile) {
    return (
      <MobileLayout>
        <DashboardPage />
      </MobileLayout>
    );
  }
  // Otherwise show onboarding (which handles login + profile setup)
  return <OnboardingPage />;
}