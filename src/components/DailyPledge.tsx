import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import { CheckCircle2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { User } from '@shared/types';
import { useHaptic } from '@/hooks/use-haptic';
export function DailyPledge() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const isGuest = useAppStore(s => s.isGuest);
  const [isLoading, setIsLoading] = useState(false);
  const { vibrate } = useHaptic();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const isPledged = user?.lastPledgeDate === todayStr;
  const streak = user?.pledgeStreak || 0;
  const handlePledge = async () => {
    if (!user) return;
    setIsLoading(true);
    vibrate('medium');
    if (isGuest) {
      // Fake pledge logic for guest
      setTimeout(() => {
        const newStreak = (user.pledgeStreak || 0) + 1;
        setUser({
          ...user,
          lastPledgeDate: todayStr,
          pledgeStreak: newStreak
        });
        vibrate('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#8b5cf6', '#10b981']
        });
        toast.success("Pledge recorded! (Demo Mode)");
        setIsLoading(false);
      }, 500); // Small delay for realism
      return;
    }
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/pledge`, {
        method: 'POST',
        body: JSON.stringify({ date: todayStr }),
      });
      setUser(updatedUser);
      // Celebration effect
      vibrate('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#8b5cf6', '#10b981']
      });
      toast.success("Pledge recorded! Keep it up!");
    } catch (err) {
      toast.error("Failed to submit pledge");
      vibrate('error');
    } finally {
      setIsLoading(false);
    }
  };
  if (!user) return null;
  return (
    <div className="w-full mb-6">
      <AnimatePresence mode="wait">
        {!isPledged ? (
          <motion.div
            key="pledge-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-gradient-to-br from-violet-500 to-fuchsia-600 border-none shadow-lg shadow-violet-500/20 overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Flame className="w-6 h-6 text-white fill-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Daily Commitment</h3>
                <p className="text-violet-100 mb-6 text-sm max-w-xs">
                  Pledge to stay smoke-free today and keep your streak alive.
                </p>
                <Button 
                  onClick={handlePledge}
                  disabled={isLoading}
                  className="w-full bg-white text-violet-600 hover:bg-white/90 font-bold shadow-lg transition-all active:scale-95"
                >
                  {isLoading ? "Committing..." : "I Pledge For Today"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="pledged-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-emerald-500/10 border-emerald-500/20 shadow-sm overflow-hidden relative">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">Pledged for Today</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-500">Keep going strong!</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {streak} Days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}