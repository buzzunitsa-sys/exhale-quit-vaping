import React, { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { History, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { JournalEntry } from '@shared/types';
import { cn } from '@/lib/utils';
interface RecentHistoryProps {
  entries: JournalEntry[];
}
export function RecentHistory({ entries }: RecentHistoryProps) {
  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }, [entries]);
  if (recentEntries.length === 0) {
    return (
      <Card className="bg-card border border-border/50 shadow-sm transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <History className="w-5 h-5 text-sky-500" />
            Recent History
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground text-sm">No entries yet. Your journey starts now!</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-card border border-border/50 shadow-sm transition-colors duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <History className="w-5 h-5 text-sky-500" />
          Recent History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="space-y-1">
          {recentEntries.map((entry) => {
            const isHighIntensity = entry.intensity >= 7;
            const isMediumIntensity = entry.intensity >= 4 && entry.intensity < 7;
            return (
              <div 
                key={entry.id} 
                className="flex items-center justify-between py-3 px-6 hover:bg-secondary/50 transition-colors border-b border-border/30 last:border-0"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  {/* Intensity Indicator */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs",
                    isHighIntensity ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                    isMediumIntensity ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  )}>
                    {entry.intensity}
                  </div>
                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground truncate">
                      {entry.trigger}
                    </p>
                    {entry.note && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
                {/* Time */}
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs text-muted-foreground font-medium">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </p>
                  {entry.puffs && entry.puffs > 0 && (
                    <p className="text-[10px] font-bold text-red-500 mt-0.5">
                      {entry.puffs} PUFFS
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}