import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { ACHIEVEMENTS } from '@/lib/achievements';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
export function AchievementsPage() {
  const user = useAppStore(s => s.user);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Safe calculation of stats even if user is not fully loaded yet
  const quitDate = user?.profile ? new Date(user.profile.quitDate) : new Date();
  const secondsElapsed = differenceInSeconds(now, quitDate);
  const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
  const moneySaved = user?.profile ? weeksElapsed * user.profile.unitsPerWeek * user.profile.costPerUnit : 0;
  const podsAvoided = user?.profile ? Math.floor(weeksElapsed * user.profile.unitsPerWeek) : 0;
  // Calculate puffs today for taper achievement
  const journal = user?.journal || [];
  const todayEntries = journal.filter(entry => isSameDay(entry.timestamp, now));
  const puffsToday = todayEntries.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
  const dailyLimit = user?.profile?.dailyLimit || 0;
  const stats = { secondsFree: secondsElapsed, moneySaved, podsAvoided, dailyLimit, puffsToday };
  const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(stats)).length;
  // Trigger confetti on mount if user has achievements (optional, maybe too noisy if global celebration exists)
  // Keeping it subtle here or removing if MilestoneCelebration handles it.
  // Let's keep a small burst if they open the page and have unlocked something recently?
  // For now, we'll rely on the visual shimmer and the global celebration for the "event".
  if (!user?.profile) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-24 transition-colors duration-300">
      <PageHeader
        title="Achievements"
        subtitle="Your trophy case of freedom."
        rightElement={
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-center">
            <span className="block text-2xl font-bold text-white leading-none">
                {unlockedCount}
            </span>
            <span className="text-[10px] font-medium text-sky-100 uppercase tracking-wider">
                UNLOCKED
            </span>
          </div>
        }
      />
      <div className="px-4 grid grid-cols-2 gap-4 relative z-10">
        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = achievement.condition(stats);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.03 } : {}}
            >
              <Card className={cn(
                "h-full border-none shadow-sm transition-all duration-300 relative overflow-hidden",
                isUnlocked
                  ? "bg-card dark:bg-card border border-sky-100 dark:border-sky-900 shadow-md"
                  : "bg-slate-100 dark:bg-muted/50 opacity-70 grayscale"
              )}>
                {/* Shimmer effect for unlocked cards */}
                {isUnlocked && (
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />
                )}
                <CardContent className="p-5 flex flex-col items-center text-center gap-3 h-full justify-center relative z-20">
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-500",
                    isUnlocked
                      ? "bg-gradient-to-br from-sky-400 to-violet-500 text-white shadow-lg shadow-violet-500/30 scale-110"
                      : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                  )}>
                    {isUnlocked ? achievement.icon : <Trophy className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-semibold mb-1 text-sm sm:text-base",
                      isUnlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}