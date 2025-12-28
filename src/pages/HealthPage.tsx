import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatsChart } from '@/components/ui/stats-chart';
import { StatsSummary } from '@/components/ui/stats-summary';
import { cn } from '@/lib/utils';
type Tab = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export function HealthPage() {
  const [activeTab, setActiveTab] = useState<Tab>('WEEKLY');
  return (
    <div className="min-h-screen bg-slate-50 pb-24 flex flex-col">
      {/* Blue Gradient Header Section */}
      <div className="bg-gradient-to-b from-blue-400 to-cyan-300 pt-8 pb-16 px-4 relative z-0">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full backdrop-blur-md">
            {(['DAILY', 'WEEKLY', 'MONTHLY'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold transition-all duration-200",
                  activeTab === tab
                    ? "bg-white text-blue-500 shadow-sm"
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
          <StatsChart />
        </div>
      </div>
      {/* Bottom Sheet Content Area */}
      <div className="flex-1 bg-slate-50 rounded-t-[40px] -mt-12 relative z-10 px-4 pt-8 space-y-6">
        {/* Sample Data Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center"
        >
          <p className="text-yellow-600 text-sm font-medium">
            You are viewing sample data
          </p>
        </motion.div>
        {/* Stats Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsSummary />
        </motion.div>
      </div>
    </div>
  );
}