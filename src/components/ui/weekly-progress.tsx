import React from 'react';
import { Check, X, Minus, Trophy, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { DailyConsistency } from '@/lib/stats-utils';
interface WeeklyProgressProps {
  data: DailyConsistency[];
}
export function WeeklyProgress({ data }: WeeklyProgressProps) {
  // Calculate streak (working backwards from today)
  let currentStreak = 0;
  // We reverse a copy of the array to count backwards from today (last element)
  const reversedData = [...data].reverse();
  for (const day of reversedData) {
    if (day.status === 'clean' || day.status === 'under-limit') {
      currentStreak++;
    } else if (day.status === 'unknown') {
      // Don't break streak for future days or days before start, but don't count them either
      continue;
    } else {
      break;
    }
  }
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground text-lg">Weekly Consistency</h3>
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-bold text-foreground">
            {currentStreak} Day Streak
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <TooltipProvider delayDuration={100}>
          {data.map((day, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-2 cursor-default group">
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    day.status === 'clean'
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : day.status === 'under-limit'
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : day.status === 'over-limit'
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-500"
                      : "bg-secondary border-transparent text-muted-foreground/50"
                  )}>
                    {day.status === 'clean' ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : day.status === 'under-limit' ? (
                      <Check className="w-5 h-5" />
                    ) : day.status === 'over-limit' ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Circle className="w-3 h-3 fill-current" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    day.status === 'clean' || day.status === 'under-limit'
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-muted-foreground"
                  )}>
                    {day.label}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <div className="text-center">
                  <p className="font-bold mb-1">{day.fullDate}</p>
                  <p>{day.status === 'clean' ? 'Smoke Free!' : day.status === 'unknown' ? 'Not Started' : `${day.puffs} puffs`}</p>
                  {day.limit > 0 && day.status !== 'clean' && day.status !== 'unknown' && (
                    <p className="text-muted-foreground opacity-80">Limit: {day.limit}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}