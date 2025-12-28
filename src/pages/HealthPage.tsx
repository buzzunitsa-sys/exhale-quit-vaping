import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsChart } from '@/components/ui/stats-chart';
import { StatsSummary } from '@/components/ui/stats-summary';
import { RecoveryTimeline } from '@/components/RecoveryTimeline';
import { TriggerChart } from '@/components/TriggerChart';
import { RecentHistory } from '@/components/RecentHistory';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { User } from '@shared/types';
import {
  getChartData,
  getSummaryStats,
  filterEntriesByRange,
  getTriggerDistribution,
  type TimeRange
} from '@/lib/stats-utils';
import { BarChart3, Activity } from 'lucide-react';
type ViewMode = 'stats' | 'recovery';
export function HealthPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('stats');
  const [activeTab, setActiveTab] = useState<TimeRange>('WEEKLY');
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const isGuest = useAppStore(s => s.isGuest);
  // Memoize journal to prevent unstable dependency
  const journal = useMemo(() => user?.journal || [], [user?.journal]);
  // Filter entries based on selected time range
  const filteredEntries = useMemo(() => {
    return filterEntriesByRange(journal, activeTab);
  }, [journal, activeTab]);
  const chartData = useMemo(() => {
    return getChartData(journal, activeTab);
  }, [journal, activeTab]);
  const summaryStats = useMemo(() => {
    return getSummaryStats(journal);
  }, [journal]);
  const triggerData = useMemo(() => {
    return getTriggerDistribution(filteredEntries);
  }, [filteredEntries]);
  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this entry?")) {
      if (isGuest) {
        // Local update for guest
        const updatedJournal = (user.journal || []).filter(e => e.id !== entryId);
        setUser({ ...user, journal: updatedJournal });
        toast.success("Entry deleted (Demo Mode)");
      } else {
        // API call for real user
        try {
          const updatedUser = await api<User>(`/api/user/${user.id}/journal/${entryId}`, {
            method: 'DELETE',
          });
          setUser(updatedUser);
          toast.success("Entry deleted");
        } catch (err) {
          toast.error("Failed to delete entry");
        }
      }
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-24 flex flex-col transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 pt-8 pb-8 px-4 relative z-0 rounded-b-[40px] shadow-lg shadow-blue-200/50 dark:shadow-none">
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
        "flex-1 px-4 space-y-6 relative z-10 transition-all duration-300",
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
              className="space-y-6"
            >
              <StatsSummary stats={summaryStats} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TriggerChart data={triggerData} />
                <RecentHistory entries={journal} onDelete={handleDeleteEntry} />
              </div>
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