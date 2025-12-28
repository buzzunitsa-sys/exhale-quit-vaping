import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds } from 'date-fns';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Award, Crown, Zap, Shield, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
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
    <div className="min-h-screen bg-slate-50 pb-24">
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
              <Card className={`h-full border-none shadow-sm transition-all duration-300 relative overflow-hidden ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-bling-cyan/20 to-bling-purple/20 shadow-lg shadow-bling-purple/10 border border-bling-cyan/30' 
                  : 'bg-slate-100 dark:bg-slate-800/50 opacity-70 grayscale'
              }`}>
                {/* Shimmer effect for unlocked cards */}
                {isUnlocked && (
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 pointer-events-none" />
                )}
                <CardContent className="p-5 flex flex-col items-center text-center gap-3 h-full justify-center relative z-20">
                  <div className={`p-3 rounded-full transition-all duration-500 ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-bling-cyan to-bling-purple text-white shadow-lg shadow-bling-purple/30 scale-110' 
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