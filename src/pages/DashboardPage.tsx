import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Card, CardContent } from '@/components/ui/card';
import { differenceInSeconds } from 'date-fns';
import { Wallet, Wind, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { SavingsChart } from '@/components/SavingsChart';
export function DashboardPage() {
  const user = useAppStore(s => s.user);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!user?.profile) return null;
  const quitDate = new Date(user.profile.quitDate);
  const secondsElapsed = differenceInSeconds(now, quitDate);
  // Calculations
  const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
  const moneySaved = weeksElapsed * user.profile.unitsPerWeek * user.profile.costPerUnit;
  const podsAvoided = Math.floor(weeksElapsed * user.profile.unitsPerWeek);
  // Daily savings rate for projection
  const dailySavings = (user.profile.unitsPerWeek * user.profile.costPerUnit) / 7;
  // Time breakdown
  const days = Math.floor(secondsElapsed / (3600 * 24));
  const hours = Math.floor((secondsElapsed % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = Math.floor(secondsElapsed % 60);
  return (
    <div className="p-4 space-y-6 pt-8 md:pt-12 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Freedom Dashboard</h2>
          <p className="text-slate-500">Keep going, you're doing great!</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bling-cyan to-bling-purple flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-bling-purple/30">
          {user.name?.[0] || user.email[0].toUpperCase()}
        </div>
      </header>
      {/* Main Timer */}
      <div className="flex flex-col items-center justify-center py-8">
        <CircularProgress 
            value={Math.min((secondsElapsed / (24 * 60 * 60)) * 100, 100)} 
            size={280} 
            strokeWidth={12}
            showGradient={true}
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-bling-cyan to-bling-purple">
              {days}
            </div>
            <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Days Free</div>
            <div className="flex gap-2 text-xl font-mono text-slate-600 dark:text-slate-300">
              <span>{hours.toString().padStart(2, '0')}</span>:
              <span>{minutes.toString().padStart(2, '0')}</span>:
              <span>{seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </CircularProgress>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5 text-bling-purple" />}
          label="Money Saved"
          value={`${moneySaved.toFixed(2)}`}
          delay={0.1}
        />
        <StatCard
          icon={<Wind className="w-5 h-5 text-bling-cyan" />}
          label="Pods Avoided"
          value={podsAvoided.toString()}
          delay={0.2}
        />
      </div>
      {/* Savings Projection Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <SavingsChart
          currentSavings={moneySaved}
          dailySavings={dailySavings}
          currency={user.profile.currency}
        />
      </motion.div>
      {/* Motivation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-bling-cyan to-bling-purple text-white border-none shadow-lg shadow-bling-purple/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Health Recovery</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Your oxygen levels are returning to normal. Carbon monoxide is leaving your body.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
function StatCard({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="p-2 w-fit rounded-lg bg-slate-50 dark:bg-slate-800">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}