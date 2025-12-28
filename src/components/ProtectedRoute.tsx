import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { MobileLayout } from '@/components/layout/MobileLayout';
export function ProtectedRoute() {
  const user = useAppStore(s => s.user);
  if (!user?.profile) {
    return <Navigate to="/" replace />;
  }
  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  );
}