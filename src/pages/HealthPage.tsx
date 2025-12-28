import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsChart } from '@/components/ui/stats-chart';
import { StatsSummary } from '@/components/ui/stats-summary';
import { RecoveryTimeline } from '@/components/RecoveryTimeline';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { getChartData, getSummaryStats, type TimeRange } from '@/lib/stats-utils';
import { BarChart3, Activity } from 'lucide-react';
type ViewMode = 'stats' | 'recovery';
export function HealthPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('stats');
  const [activeTab, setActiveTab] = useState<TimeRange>('WEEKLY');
  const user = useAppStore(s => s.user);
  // Memoize journal to prevent unstable dependency
  const journal = useMemo(() => user?.journal || [], [user?.journal]);
  const chartData = useMemo(() => {
    return getChartData(journal, activeTab);
  }, [journal, activeTab]);
  const summaryStats = useMemo(() => {
    return getSummaryStats(journal);
  }, [journal]);
  return (
    <div className="min-h-screen bg-slate-50 pb-24 flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 pt-8 pb-8 px-4 relative z-0 rounded-b-[40px] shadow-lg shadow-blue-200/50">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Health & Progress</h1>
        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/20 p-1 rounded-xl flex gap-1 backdrop-blur-md">
            <button
              onClick={() => setViewMode('stats')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                viewMode === 'stats' 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Statistics
            </button>
            <button
              onClick={() => setViewMode('recovery')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                viewMode === 'recovery' 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              <Activity className="w-4 h-4" />
              Recovery
            </button>
          </div>
        </div>
        {/* Conditional Header Content: Time Range Tabs (Only for Stats) */}
        <AnimatePresence mode="wait">
          {viewMode === 'stats' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full backdrop-blur-md">
                  {(['DAILY', 'WEEKLY', 'MONTHLY'] as TimeRange[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                        activeTab === tab
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              {/* Chart Area */}
              <div className="mb-8 h-[300px]">
                <StatsChart data={chartData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Main Content Area */}
      <div className={cn(
        "flex-1 bg-slate-50 px-4 space-y-6 relative z-10 transition-all duration-300",
        viewMode === 'stats' ? "-mt-6" : "pt-6"
      )}>
        <AnimatePresence mode="wait">
          {viewMode === 'stats' ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StatsSummary stats={summaryStats} />
            </motion.div>
          ) : (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RecoveryTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}