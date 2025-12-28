import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds } from 'date-fns';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Award, Crown, Zap, Shield, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Achievement } from '@/types/app';
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
  const stats = { secondsFree: secondsElapsed, moneySaved, podsAvoided };
  const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(stats)).length;
  if (!user?.profile) return null;
  return (
    <div className="p-4 space-y-6 pt-8 md:pt-12 pb-24">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h2>
            <p className="text-slate-500">Your trophy case of freedom.</p>
        </div>
        <div className="text-right">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-bling-cyan to-bling-purple">
                {unlockedCount}
            </span>
            <span className="text-slate-400 text-sm">/{ACHIEVEMENTS.length}</span>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = achievement.condition(stats);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full border-none shadow-sm transition-all duration-300 ${
                isUnlocked
                  ? 'bg-gradient-to-br from-bling-cyan/10 to-bling-purple/10 shadow-md border border-bling-cyan/20'
                  : 'bg-slate-100 dark:bg-slate-800/50 opacity-70 grayscale'
              }`}>
                <CardContent className="p-5 flex flex-col items-center text-center gap-3 h-full justify-center">
                  <div className={`p-3 rounded-full ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-bling-cyan to-bling-purple text-white shadow-lg shadow-bling-purple/30'
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-700'
                  }`}>
                    {isUnlocked ? achievement.icon : <Trophy className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
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