import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import { Quote, CheckCircle2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getDailyQuote } from '@/lib/quotes';
import { toast } from 'sonner';
import type { User } from '@shared/types';
import { useHaptic } from '@/hooks/use-haptic';
export function DailyPledge() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const { vibrate } = useHaptic();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const isPledged = user?.lastPledgeDate === todayStr;
  const streak = user?.pledgeStreak || 0;
  const dailyQuote = getDailyQuote();
  const handlePledge = async () => {
    if (!user) return;
    setIsLoading(true);
    vibrate('medium');
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
            key="quote-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="bg-card border-border/50 shadow-sm overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Pledged for Today</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {streak} Day Streak
                    </span>
                  </div>
                </div>
                <div className="relative pl-4 border-l-4 border-violet-200 dark:border-violet-900/50 py-1">
                  <Quote className="absolute -top-2 -left-2 w-4 h-4 text-violet-300 dark:text-violet-800 fill-violet-300 dark:fill-violet-800" />
                  <p className="text-foreground font-medium italic text-lg leading-relaxed mb-2">
                    "{dailyQuote.text}"
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    — {dailyQuote.author}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}