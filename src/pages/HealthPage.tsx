import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { StatsChart } from '@/components/ui/stats-chart';
import { StatsSummary } from '@/components/ui/stats-summary';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { getChartData, getSummaryStats, type TimeRange } from '@/lib/stats-utils';
export function HealthPage() {
  const [activeTab, setActiveTab] = useState<TimeRange>('WEEKLY');
  const user = useAppStore(s => s.user);
  // Fix: Memoize journal to prevent unstable dependency in subsequent useMemos
  // This resolves the react-hooks/exhaustive-deps warning
  const journal = useMemo(() => user?.journal || [], [user?.journal]);
  const chartData = useMemo(() => {
    return getChartData(journal, activeTab);
  }, [journal, activeTab]);
  const summaryStats = useMemo(() => {
    return getSummaryStats(journal);
  }, [journal]);
  return (
    <div className="min-h-screen bg-slate-50 pb-24 flex flex-col">
      {/* Blue Gradient Header Section - Updated for Blue Dominance */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 pt-8 pb-16 px-4 relative z-0">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full backdrop-blur-md">
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as TimeRange[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold transition-all duration-200",
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm" // Updated active text color to purple hint
                    : "text-white hover:bg-white/10"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Chart Area */}
        <div className="mb-8">
          <StatsChart data={chartData} />
        </div>
      </div>
      {/* Bottom Sheet Content Area */}
      <div className="flex-1 bg-slate-50 rounded-t-[40px] -mt-12 relative z-10 px-4 pt-8 space-y-6">
        {/* Stats Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsSummary stats={summaryStats} />
        </motion.div>
      </div>
    </div>
  );
}