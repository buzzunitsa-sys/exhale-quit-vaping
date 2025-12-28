import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RECOVERY_MILESTONES } from '@/data/recovery-milestones';
import { cn } from '@/lib/utils';
export function RecoveryTimeline() {
  const user = useAppStore(s => s.user);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!user?.profile) return null;
  const quitDate = new Date(user.profile.quitDate);
  const secondsElapsed = Math.max(0, differenceInSeconds(now, quitDate));
  return (
    <div className="space-y-4 pb-8">
      {RECOVERY_MILESTONES.map((milestone, index) => {
        const progress = Math.min(100, Math.max(0, (secondsElapsed / milestone.durationSeconds) * 100));
        const isCompleted = progress >= 100;
        const isLocked = progress === 0;
        const isActive = progress > 0 && progress < 100;
        const Icon = milestone.icon;
        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              "border-none shadow-sm transition-all duration-300 overflow-hidden",
              isCompleted ? "bg-white dark:bg-slate-900" : 
              isActive ? "bg-white dark:bg-slate-900 ring-2 ring-sky-500/20" : 
              "bg-slate-50 dark:bg-slate-900/50 opacity-70"
            )}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors",
                    isCompleted ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    isActive ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" :
                    "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : 
                     isLocked ? <Lock className="w-5 h-5" /> :
                     <Icon className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn(
                        "font-semibold text-base truncate pr-2",
                        isCompleted ? "text-slate-900 dark:text-white" : 
                        isActive ? "text-sky-700 dark:text-sky-400" : 
                        "text-slate-500"
                      )}>
                        {milestone.title}
                      </h3>
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap",
                        isCompleted ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        isActive ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" :
                        "bg-slate-200 text-slate-500 dark:bg-slate-800"
                      )}>
                        {isCompleted ? "DONE" : isActive ? `${progress.toFixed(0)}%` : "LOCKED"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {milestone.description}
                    </p>
                    {/* Progress Bar */}
                    <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className={cn(
                          "absolute top-0 left-0 h-full rounded-full",
                          isCompleted ? "bg-emerald-500" : "bg-sky-500"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    {isActive && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>In progress... keep going!</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}