import React, { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds, format, isSameDay } from 'date-fns';
import { Crown, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TimerDisplay } from '@/components/ui/timer-display';
import { DateStrip } from '@/components/ui/date-strip';
import { PuffCounter } from '@/components/ui/puff-counter';
import { HourlyChart } from '@/components/ui/hourly-chart';
import { SavingsChart } from '@/components/SavingsChart';
import { ShareButton } from '@/components/ui/share-button';
import { useHaptic } from '@/hooks/use-haptic';
export function DashboardPage() {
  const user = useAppStore(s => s.user);
  const [now, setNow] = useState(new Date());
  const { vibrate } = useHaptic();
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Calculate slips for today
  const puffsTakenToday = useMemo(() => {
    if (!user?.journal) return 0;
    const today = new Date();
    return user.journal
      .filter(entry => isSameDay(entry.timestamp, today))
      .reduce((sum, entry) => sum + (entry.puffs || 0), 0);
  }, [user?.journal, now]); // Re-calc if journal changes or day changes (via now)
  if (!user?.profile) return null;
  const quitDate = new Date(user.profile.quitDate);
  const secondsElapsed = differenceInSeconds(now, quitDate);
  // Calculate avoided stats
  // Assumption: 1 pod = 200 puffs = 50mg nicotine (approx 5% strength)
  // unitsPerWeek is pods per week
  const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
  const podsAvoided = weeksElapsed * user.profile.unitsPerWeek;
  const puffsAvoided = podsAvoided * 200;
  const nicotineAvoided = podsAvoided * 50; // mg
  // Calculate savings
  const moneySaved = weeksElapsed * user.profile.unitsPerWeek * user.profile.costPerUnit;
  const dailySavings = (user.profile.unitsPerWeek * user.profile.costPerUnit) / 7;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32 transition-colors duration-300">
      {/* Header Section with Gradient - Blue Dominant with Purple Hint */}
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
              secondsFree={secondsElapsed}
              moneySaved={moneySaved}
              currency={user.profile.currency}
            />
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
        <TimerDisplay secondsElapsed={secondsElapsed} />
        <PuffCounter 
          puffs={puffsAvoided} 
          nicotine={nicotineAvoided} 
          limit={0} 
          puffsTaken={puffsTakenToday}
        />
        <div className="w-full overflow-hidden rounded-3xl">
          <SavingsChart
            currentSavings={moneySaved}
            dailySavings={dailySavings}
            currency={user.profile.currency}
          />
        </div>
        <div className="w-full overflow-hidden rounded-3xl">
          <HourlyChart entries={user.journal} />
        </div>
      </div>
    </div>
  );
}