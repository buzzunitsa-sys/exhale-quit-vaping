import React from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function GuestBanner() {
  const isGuest = useAppStore(s => s.isGuest);
  const logout = useAppStore(s => s.logout);
  const navigate = useNavigate();
  if (!isGuest) return null;
  const handleSignUp = () => {
    logout(); // Clear guest session
    navigate('/'); // Go to onboarding
  };
  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
      <div className="bg-violet-600/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-lg shadow-violet-900/20 border border-violet-500/50 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="text-sm font-medium text-center sm:text-left">
          <p>You are viewing a demo.</p>
          <p className="text-violet-200 text-xs mt-0.5">Sign in to save your progress.</p>
        </div>
        <Button 
          onClick={handleSignUp}
          size="sm" 
          className="bg-white text-violet-600 hover:bg-violet-50 whitespace-nowrap w-full sm:w-auto font-bold"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
      </div>
    </div>
  );
}