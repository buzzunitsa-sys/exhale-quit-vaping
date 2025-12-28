import React, { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Timer, History } from 'lucide-react';
import type { JournalEntry } from '@shared/types';
import { Card } from '@/components/ui/card';
interface TimeSinceLastPuffProps {
  journal: JournalEntry[];
  quitDate: string;
}
export function TimeSinceLastPuff({ journal, quitDate }: TimeSinceLastPuffProps) {
  const [now, setNow] = useState(new Date());
  const [lastPuffTime, setLastPuffTime] = useState<number>(0);
  useEffect(() => {
    // Find the most recent entry with puffs > 0
    const slips = journal.filter(e => (e.puffs || 0) > 0);
    if (slips.length > 0) {
      // Sort descending by timestamp
      slips.sort((a, b) => b.timestamp - a.timestamp);
      setLastPuffTime(slips[0].timestamp);
    } else {
      // If no slips, use quit date
      setLastPuffTime(new Date(quitDate).getTime());
    }
  }, [journal, quitDate]);
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const secondsElapsed = Math.max(0, differenceInSeconds(now, lastPuffTime));
  const days = Math.floor(secondsElapsed / (3600 * 24));
  const hours = Math.floor((secondsElapsed % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  return (
    <Card className="bg-card border border-border/50 shadow-sm p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
          <History className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time Since Last Puff</p>
          <p className="text-lg font-bold text-foreground font-mono">
            {days}d {hours}h {minutes}m
          </p>
        </div>
      </div>
      <Timer className="w-5 h-5 text-muted-foreground/30" />
    </Card>
  );
}