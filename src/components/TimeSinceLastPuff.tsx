import React from 'react';
import { differenceInSeconds } from 'date-fns';
import { Timer, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
interface TimeSinceLastPuffProps {
  lastPuffTime: number;
  now: Date;
}
export function TimeSinceLastPuff({ lastPuffTime, now }: TimeSinceLastPuffProps) {
  const secondsElapsed = Math.max(0, differenceInSeconds(now, lastPuffTime));
  const days = Math.floor(secondsElapsed / (3600 * 24));
  const hours = Math.floor((secondsElapsed % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = Math.floor(secondsElapsed % 60);
  return (
    <Card className="bg-gradient-to-br from-card to-secondary/50 border border-border/50 shadow-lg p-6 mb-6 relative overflow-hidden group">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors duration-500" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shadow-inner ring-1 ring-orange-200 dark:ring-orange-800">
            <History className="w-6 h-6 text-orange-500 animate-pulse-slow" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Time Since Last Puff</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground font-mono tracking-tight">
                {days}d {hours}h {minutes}m
              </span>
              <span className="text-sm font-mono text-muted-foreground w-6">
                {seconds}s
              </span>
            </div>
          </div>
        </div>
        <Timer className="w-6 h-6 text-muted-foreground/20" />
      </div>
    </Card>
  );
}