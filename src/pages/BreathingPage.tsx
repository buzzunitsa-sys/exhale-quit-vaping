import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BreathingCircle } from '@/components/ui/breathing-circle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { useHaptic } from '@/hooks/use-haptic';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
export function BreathingPage() {
  const navigate = useNavigate();
  const { vibrate } = useHaptic();
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const isGuest = useAppStore(s => s.isGuest);
  const handleExit = async () => {
    vibrate('success');
    if (user) {
      // Log the breathing session
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        intensity: 0, // Not a craving, but a relief action
        trigger: "Breathing Exercise",
        note: "Completed SOS breathing session"
      };
      if (isGuest) {
        // Local update for guest
        setUser({
          ...user,
          journal: [entry, ...(user.journal || [])]
        });
        // Navigate with state to trigger dashboard celebration
        navigate('/dashboard', { state: { breathingCompleted: true } });
        return;
      }
      try {
        const updatedUser = await api<User>(`/api/user/${user.id}/journal`, {
          method: 'POST',
          body: JSON.stringify({ entry }),
        });
        setUser(updatedUser);
        // Navigate with state to trigger dashboard celebration
        navigate('/dashboard', { state: { breathingCompleted: true } });
      } catch (err) {
        console.error("Failed to log breathing session", err);
        // Don't block exit on error, just warn
        toast.error("Could not log session, but great job breathing!");
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-violet-100 to-emerald-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 animate-pulse-slow opacity-50 z-0" />
      {/* Minimal Header */}
      <header className="p-4 flex items-center relative z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-foreground hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold text-foreground">SOS Assistant</h1>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">4-7-8 Breathing</h2>
          <p className="text-muted-foreground max-w-xs mx-auto text-lg">
            Follow the rhythm to lower your heart rate and reduce cravings.
          </p>
        </div>
        <BreathingCircle />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 12, duration: 0.8 }} // Show button after a full cycle roughly
          className="mt-8 w-full max-w-xs"
        >
          <Button 
            onClick={handleExit}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white shadow-xl shadow-emerald-500/20 rounded-full transition-transform active:scale-95"
          >
            <Check className="w-6 h-6 mr-2" />
            I'm feeling better
          </Button>
        </motion.div>
      </main>
    </div>
  );
}