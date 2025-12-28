import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap, Shield, Target, Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import type { Achievement } from '@/types/app';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1day',
    title: 'First Step',
    description: 'Stay smoke-free for 24 hours',
    type: 'time',
    icon: <Star className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 24 * 60 * 60,
  },
  {
    id: '3days',
    title: 'Chemical Free',
    description: '3 days without nicotine',
    type: 'health',
    icon: <Zap className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 3 * 24 * 60 * 60,
  },
  {
    id: '1week',
    title: 'Week Warrior',
    description: 'One full week of freedom',
    type: 'time',
    icon: <Shield className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 7 * 24 * 60 * 60,
  },
  {
    id: 'save20',
    title: 'Pocket Change',
    description: 'Save your first $20',
    type: 'money',
    icon: <Target className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 20,
  },
  {
    id: 'save100',
    title: 'Baller',
    description: 'Save $100 not buying vapes',
    type: 'money',
    icon: <Award className="w-6 h-6" />,
    condition: ({ moneySaved }) => moneySaved >= 100,
  },
  {
    id: '1month',
    title: 'Master of Self',
    description: 'One month smoke-free',
    type: 'time',
    icon: <Crown className="w-6 h-6" />,
    condition: ({ secondsFree }) => secondsFree >= 30 * 24 * 60 * 60,
  },
  {
    id: 'taper',
    title: 'Taper Master',
    description: 'Stay under your daily limit today',
    type: 'health',
    icon: <Scale className="w-6 h-6" />,
    condition: ({ dailyLimit, puffsToday }) => dailyLimit > 0 && puffsToday <= dailyLimit,
  },
];
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
  // Trigger confetti on mount if user has achievements
  useEffect(() => {
    if (unlockedCount > 0) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [unlockedCount]);
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