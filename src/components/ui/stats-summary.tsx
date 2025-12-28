import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { SummaryStats } from '@/lib/stats-utils';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';
interface StatsSummaryProps {
  stats: SummaryStats;
}
export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <Card className="bg-card border border-border/50 shadow-sm w-full transition-colors duration-300">
      <CardContent className="pt-6 pb-8 px-6">
        <h3 className="text-center text-lg font-semibold text-foreground mb-8">This Week</h3>
        <div className="flex justify-between items-start mb-10">
          {/* Main Stat: Cravings */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-5xl font-bold text-foreground tracking-tighter">
              {stats.totalPuffs}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-2 text-center">CRAVINGS LOGGED</span>
          </div>
          {/* Secondary Stat: Actual Puffs */}
          <div className="flex flex-col items-center flex-1 border-l border-border/50">
            <span className={cn(
              "text-5xl font-bold tracking-tighter",
              stats.actualPuffs > 0 ? "text-red-500" : "text-emerald-500"
            )}>
              {stats.actualPuffs}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-2 text-center">ACTUAL PUFFS</span>
          </div>
        </div>
        {/* Tertiary Stats List */}
        <div className="space-y-4 px-4">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-sm font-medium">Days with slips:</span>
            <span className={cn("text-sm font-bold", stats.daysWithSmoke > 0 ? "text-red-500" : "text-foreground")}>
              {stats.daysWithSmoke}
            </span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-sm font-medium">Days clean:</span>
            <span className="text-sm font-bold text-emerald-500">{stats.daysNoSmoke}</span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-sm font-medium">Cravings Resisted:</span>
            <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
              <Shield className="w-3 h-3" /> {stats.resisted}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}