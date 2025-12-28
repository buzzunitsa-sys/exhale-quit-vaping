import React from 'react';
import { useAppStore } from '@/lib/store';
import { OnboardingPage } from './OnboardingPage';
import { Navigate } from 'react-router-dom';
export function HomePage() {
  const user = useAppStore(s => s.user);
  // If user is logged in AND has a profile, redirect to dashboard
  if (user?.profile) {
    return <Navigate to="/dashboard" replace />;
  }
  // Otherwise show onboarding (which handles login + profile setup)
  return <OnboardingPage />;
}