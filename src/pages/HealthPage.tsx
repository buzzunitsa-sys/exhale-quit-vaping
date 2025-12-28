import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds } from 'date-fns';
import { motion } from 'framer-motion';
import { Heart, Wind, Brain, Activity, Smile, Zap, CheckCircle2, Circle, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { PageHeader } from '@/components/ui/page-header';
import type { HealthMilestone } from '@/types/app';
const MILESTONES: HealthMilestone[] = [
  {
    id: '20m',
    title: '20 Minutes',
    description: 'Your heart rate and blood pressure drop to normal levels.',
    durationSeconds: 20 * 60,
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: '8h',
    title: '8 Hours',
    description: 'Carbon monoxide levels in your blood drop to normal. Oxygen levels increase.',
    durationSeconds: 8 * 60 * 60,
    icon: <Wind className="w-5 h-5" />,
  },
  {
    id: '24h',
    title: '24 Hours',
    description: 'Your risk of heart attack begins to decrease.',
    durationSeconds: 24 * 60 * 60,
    icon: <Activity className="w-5 h-5" />,
  },
  {
    id: '48h',
    title: '48 Hours',
    description: 'Nerve endings start to regrow. Your sense of smell and taste improve.',
    durationSeconds: 48 * 60 * 60,
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: '72h',
    title: '3 Days',
    description: 'Nicotine is completely out of your body. Breathing becomes easier.',
    durationSeconds: 72 * 60 * 60,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: '1w',
    title: '1 Week',
    description: 'Cravings may peak but will start to subside. You are building new habits.',
    durationSeconds: 7 * 24 * 60 * 60,
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: '2w',
    title: '2 Weeks',
    description: 'Circulation improves. Lung function increases up to 30%.',
    durationSeconds: 14 * 24 * 60 * 60,
    icon: <Smile className="w-5 h-5" />,
  },
  {
    id: '1m',
    title: '1 Month',
    description: 'Coughing and shortness of breath decrease. Cilia regain normal function.',
    durationSeconds: 30 * 24 * 60 * 60,
    icon: <Wind className="w-5 h-5" />,
  },
];
export function HealthPage() {
  const user = useAppStore(s => s.user);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!user?.profile) return null;
  const quitDate = new Date(user.profile.quitDate);
  const secondsElapsed = differenceInSeconds(now, quitDate);
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <PageHeader 
        title="Health Timeline" 
        subtitle="Watch your body heal in real-time as you stay smoke-free."
      />
      <div className="px-4 space-y-6 relative z-10">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
          {MILESTONES.map((milestone, index) => {
            const isCompleted = secondsElapsed >= milestone.durationSeconds;
            const isNext = !isCompleted && (index === 0 || secondsElapsed >= MILESTONES[index - 1].durationSeconds);
            let progress = 0;
            if (isCompleted) progress = 100;
            else if (isNext) {
               const prevDuration = index === 0 ? 0 : MILESTONES[index - 1].durationSeconds;
               const totalDuration = milestone.durationSeconds - prevDuration;
               const currentElapsed = secondsElapsed - prevDuration;
               progress = Math.max(0, Math.min(100, (currentElapsed / totalDuration) * 100));
            }
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative z-10 pl-16 mb-6"
              >
                {/* Icon/Status Indicator */}
                <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-full border-4 border-slate-50 dark:border-slate-950">
                  {isCompleted ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-bling-cyan to-bling-purple rounded-full flex items-center justify-center text-white shadow-lg shadow-bling-purple/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : isNext ? (
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                      <CircularProgress 
                          value={progress} 
                          size={40} 
                          strokeWidth={4} 
                          showGradient={true}
                      >
                          <div className="text-bling-purple">
                              {milestone.icon}
                          </div>
                      </CircularProgress>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                      <Circle className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <Card className={`border-none shadow-sm transition-colors ${isCompleted ? 'bg-bling-cyan/5 dark:bg-bling-purple/10' : 'bg-white dark:bg-slate-900'}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${isCompleted ? 'text-bling-purple dark:text-bling-cyan' : 'text-slate-900 dark:text-white'}`}>
                        {milestone.title}
                      </h3>
                      {isNext && (
                          <span className="text-xs font-medium text-bling-purple bg-bling-purple/10 px-2 py-0.5 rounded-full">
                              In Progress
                          </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}