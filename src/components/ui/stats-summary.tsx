import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { SummaryStats } from '@/lib/stats-utils';
interface StatsSummaryProps {
  stats: SummaryStats;
}
export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <Card className="border-none shadow-sm bg-white w-full">
      <CardContent className="pt-6 pb-8 px-6">
        <h3 className="text-center text-lg font-semibold text-slate-800 mb-8">This Week</h3>
        <div className="flex justify-between items-start mb-10">
          {/* Main Stat: Puffs */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-6xl font-bold text-slate-700 tracking-tighter">
              {stats.totalPuffs}
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-2">PUFFS</span>
          </div>
          {/* Secondary Stat: Daily Average */}
          <div className="flex flex-col items-center flex-1 pt-4">
            <span className="text-3xl font-medium text-yellow-500">
              {stats.dailyAverage}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">DAILY AVERAGE</span>
          </div>
        </div>
        {/* Tertiary Stats List */}
        <div className="space-y-4 px-4">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-sm font-medium">days with smoke:</span>
            <span className="text-sm font-bold text-slate-700">{stats.daysWithSmoke}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-sm font-medium">days no-smoke:</span>
            <span className="text-sm font-bold text-slate-700">{stats.daysNoSmoke}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}