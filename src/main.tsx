import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { HealthPage } from '@/pages/HealthPage'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { useAppStore } from '@/lib/store'
// Protected Route Wrapper
const ProtectedRoute = () => {
  const user = useAppStore(s => s.user);
  if (!user?.profile) {
    return <Navigate to="/" replace />;
  }
  return <MobileLayout><Outlet /></MobileLayout>;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/health",
        element: <HealthPage />,
      },
      {
        path: "/achievements",
        element: <AchievementsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ]
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)