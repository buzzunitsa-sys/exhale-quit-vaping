import React from 'react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
interface DailyTrackerProps {
  puffsToday: number;
  costWasted: number;
  nicotineUsed: number;
  projectedSavings: number;
  currency: string;
  dailyLimit?: number;
  onQuickLog: () => void;
}
export function DailyTracker({
  puffsToday,
  costWasted,
  nicotineUsed,
  projectedSavings,
  currency,
  dailyLimit = 0,
  onQuickLog
}: DailyTrackerProps) {
  // Calculate percentage for the circular progress
  // If no limit is set, we just show a visual representation that fills up to 100 at 50 puffs (arbitrary visual cap)
  // If limit is set, it's percentage of limit
  const visualLimit = dailyLimit > 0 ? dailyLimit : 50;
  const progressValue = Math.min(100, (puffsToday / visualLimit) * 100);
  // Determine color based on usage vs limit (if limit exists)
  const isOverLimit = dailyLimit > 0 && puffsToday > dailyLimit;
  const progressColor = isOverLimit ? "text-red-500" : "text-sky-500";
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm transition-colors duration-300">
      <div className="flex flex-col items-center justify-center mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Daily Puff Count</h3>
        <div className="relative">
          <CircularProgress 
            value={progressValue} 
            size={220} 
            strokeWidth={12} 
            color={progressColor}
            showGradient={!isOverLimit}
          >
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-foreground tracking-tighter">
                {puffsToday}
              </span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">
                PUFFS TODAY
              </span>
            </div>
          </CircularProgress>
          {/* Quick Log Button positioned at the bottom of the circle */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <Button
              onClick={onQuickLog}
              size="lg"
              className="rounded-full w-14 h-14 bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 shadow-lg shadow-sky-500/30 p-0 flex items-center justify-center"
            >
              <Plus className="w-8 h-8 text-white" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-border/50">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full mb-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-lg font-bold text-foreground">
            {currency === 'USD' ? '$' : currency}
            {costWasted.toFixed(2)}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            WASTED
          </span>
        </div>
        <div className="flex flex-col items-center text-center border-x border-border/50">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-full mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <span className="text-lg font-bold text-foreground">
            {nicotineUsed.toFixed(1)}mg
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            NICOTINE
          </span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-full mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {currency === 'USD' ? '$' : currency}
            {projectedSavings.toFixed(2)}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            SAVED
          </span>
        </div>
      </div>
    </div>
  );
}