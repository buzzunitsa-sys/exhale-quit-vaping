import React, { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { format, isSameDay, differenceInSeconds } from 'date-fns';
import { Crown, Settings2, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DateStrip } from '@/components/ui/date-strip';
import { DailyTracker } from '@/components/ui/daily-tracker';
import { HourlyChart } from '@/components/ui/hourly-chart';
import { SavingsChart } from '@/components/SavingsChart';
import { ShareButton } from '@/components/ui/share-button';
import { useHaptic } from '@/hooks/use-haptic';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
export function DashboardPage() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const [now, setNow] = useState(new Date());
  const { vibrate } = useHaptic();
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Calculate stats
  const {
    puffsToday,
    costWastedToday,
    nicotineUsedToday,
    projectedDailySavings,
    totalMoneySaved,
    dailyBaselineCost
  } = useMemo(() => {
    if (!user?.profile) {
      return {
        puffsToday: 0,
        costWastedToday: 0,
        nicotineUsedToday: 0,
        projectedDailySavings: 0,
        totalMoneySaved: 0,
        dailyBaselineCost: 0
      };
    }
    const journal = user.journal || [];
    const todayEntries = journal.filter(entry => isSameDay(entry.timestamp, now));
    const puffsToday = todayEntries.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
    // Cost calculations
    const puffsPerUnit = user.profile.puffsPerUnit || 200;
    const costPerPuff = user.profile.costPerUnit / puffsPerUnit;
    const costWastedToday = puffsToday * costPerPuff;
    // Nicotine calculations (approx 50mg per pod/unit usually, or 5% strength)
    const nicotinePerUnit = 50; // mg (standard 5% pod)
    const nicotinePerPuff = nicotinePerUnit / puffsPerUnit;
    const nicotineUsedToday = puffsToday * nicotinePerPuff;
    // Baseline daily cost = (units per week * cost per unit) / 7
    const dailyBaselineCost = (user.profile.unitsPerWeek * user.profile.costPerUnit) / 7;
    const projectedDailySavings = Math.max(0, dailyBaselineCost - costWastedToday);
    // Total Lifetime Savings Calculation
    const quitDate = new Date(user.profile.quitDate);
    const secondsElapsed = Math.max(0, differenceInSeconds(now, quitDate));
    const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
    const theoreticalMaxSavings = weeksElapsed * user.profile.unitsPerWeek * user.profile.costPerUnit;
    // Calculate total cost of all slips in history
    const totalPuffsAllTime = journal.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
    const totalCostWastedAllTime = totalPuffsAllTime * costPerPuff;
    const totalMoneySaved = Math.max(0, theoreticalMaxSavings - totalCostWastedAllTime);
    return {
      puffsToday,
      costWastedToday,
      nicotineUsedToday,
      projectedDailySavings,
      totalMoneySaved,
      dailyBaselineCost
    };
  }, [user?.journal, user?.profile, now]);
  const handleQuickLog = async () => {
    if (!user) return;
    // Quick log adds 1 puff
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      intensity: 5,
      trigger: "Quick Log",
      puffs: 1,
      note: "Quick log from dashboard"
    };
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/journal`, {
        method: 'POST',
        body: JSON.stringify({ entry: newEntry }),
      });
      setUser(updatedUser);
      vibrate('success');
      toast.success("Puff logged.");
    } catch (err) {
      vibrate('error');
      toast.error("Failed to log puff");
    }
  };
  if (!user?.profile) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32 transition-colors duration-300">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 rounded-b-[40px] pt-8 pb-20 px-6 text-white shadow-lg shadow-violet-200/50 dark:shadow-none relative z-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-1 tracking-tight">Hello</h1>
            <p className="text-sky-100 font-medium uppercase tracking-wide text-sm opacity-90">
              {format(now, 'EEEE, MMMM d')}
            </p>
          </div>
          <div className="flex gap-3">
            <ShareButton
              secondsFree={0} // Not using time free for share context anymore in this view
              moneySaved={totalMoneySaved}
              currency={user.profile.currency}
            />
            {/* SOS Breathing Button */}
            <Link
              to="/breathe"
              onClick={() => vibrate('medium')}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center justify-center group"
              title="SOS Breathing"
            >
              <Wind className="w-6 h-6 text-sky-200 group-hover:text-white transition-colors" />
            </Link>
            <Link
              to="/achievements"
              onClick={() => vibrate('light')}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <Crown className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </Link>
            <Link
              to="/profile"
              onClick={() => vibrate('light')}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <Settings2 className="w-6 h-6 text-white" />
            </Link>
          </div>
        </div>
        {/* Date Strip */}
        <div className="mb-4">
          <DateStrip />
        </div>
      </div>
      {/* Main Content - Overlapping Header */}
      <div className="px-4 -mt-12 space-y-4 relative z-10">
        <DailyTracker
          puffsToday={puffsToday}
          costWasted={costWastedToday}
          nicotineUsed={nicotineUsedToday}
          projectedSavings={projectedDailySavings}
          currency={user.profile.currency}
          dailyLimit={user.profile.dailyLimit}
          onQuickLog={handleQuickLog}
        />
        <div className="w-full overflow-hidden rounded-3xl">
          <HourlyChart entries={user.journal} />
        </div>
        <div className="w-full overflow-hidden rounded-3xl">
          <SavingsChart
            currentSavings={totalMoneySaved}
            dailySavings={dailyBaselineCost}
            currency={user.profile.currency}
          />
        </div>
      </div>
    </div>
  );
}