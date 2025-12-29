import React, { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { format, isSameDay, differenceInSeconds } from 'date-fns';
import { Crown, Settings2, Download, Flame } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { DateStrip } from '@/components/ui/date-strip';
import { DailyTracker } from '@/components/ui/daily-tracker';
import { HourlyChart } from '@/components/ui/hourly-chart';
import { SavingsChart } from '@/components/SavingsChart';
import { WeeklyProgress } from '@/components/ui/weekly-progress';
import { ShareButton } from '@/components/ui/share-button';
import { DailyPledge } from '@/components/DailyPledge';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { MilestoneCelebration } from '@/components/MilestoneCelebration';
import { BreathingCard } from '@/components/BreathingCard';
import { QuoteCarousel } from '@/components/QuoteCarousel';
import { TimeSinceLastPuff } from '@/components/TimeSinceLastPuff';
import { MotivationCard } from '@/components/MotivationCard';
import { useHaptic } from '@/hooks/use-haptic';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { User, JournalEntry } from '@shared/types';
import { getWeeklyConsistency, getLastPuffTime } from '@/lib/stats-utils';
import { getUserRank } from '@/lib/ranks';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share, PlusSquare, MoreVertical } from 'lucide-react';
import confetti from 'canvas-confetti';
export function DashboardPage() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const isGuest = useAppStore(s => s.isGuest);
  const [now, setNow] = useState(new Date());
  const { vibrate } = useHaptic();
  const location = useLocation();
  const {
    isStandalone,
    promptInstall,
    showInstructions,
    setShowInstructions,
    isIOS
  } = useInstallPrompt();
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Handle Breathing Completion Toast & Confetti
  useEffect(() => {
    if (location.state?.breathingCompleted) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#10b981', '#8b5cf6'], // Sky, Emerald, Violet
        disableForReducedMotion: true
      });
      toast.success("Mindfulness session recorded. Center found.");
      // Clear state to prevent toast on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  // Calculate stats
  const {
    puffsToday,
    costWastedToday,
    nicotineUsedToday,
    projectedDailySavings,
    totalMoneySaved,
    dailyBaselineCost,
    weeklyConsistency,
    secondsElapsed,
    secondsFreeForRank,
    lastPuffTime
  } = useMemo(() => {
    if (!user?.profile) {
      return {
        puffsToday: 0,
        costWastedToday: 0,
        nicotineUsedToday: 0,
        projectedDailySavings: 0,
        totalMoneySaved: 0,
        dailyBaselineCost: 0,
        weeklyConsistency: [],
        secondsElapsed: 0,
        secondsFreeForRank: 0,
        lastPuffTime: 0
      };
    }
    const journal = user.journal || [];
    const todayEntries = journal.filter(entry => isSameDay(entry.timestamp, now));
    const puffsToday = todayEntries.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
    // Profile Data
    const costPerUnit = user.profile.costPerUnit;
    const volumePerUnit = user.profile.volumePerUnit || 1.0;
    const mlPerPuff = user.profile.mlPerPuff || 0.05;
    const strength = user.profile.nicotineStrength ?? 50; // mg/ml
    const unitsPerWeek = user.profile.unitsPerWeek;
    const puffsPerUnitFallback = user.profile.puffsPerUnit || 200;
    // Cost Calculation Logic
    let costPerPuff = 0;
    if (volumePerUnit > 0) {
      const costPerMl = costPerUnit / volumePerUnit;
      costPerPuff = costPerMl * mlPerPuff;
    } else {
      costPerPuff = costPerUnit / puffsPerUnitFallback;
    }
    const costWastedToday = puffsToday * costPerPuff;
    const nicotinePerPuff = strength * mlPerPuff;
    const nicotineUsedToday = puffsToday * nicotinePerPuff;
    const dailyBaselineCost = (unitsPerWeek * costPerUnit) / 7;
    const projectedDailySavings = Math.max(0, dailyBaselineCost - costWastedToday);
    // Total Lifetime Savings Calculation (Based on original quit date)
    const quitDate = new Date(user.profile.quitDate);
    const secondsElapsed = Math.max(0, differenceInSeconds(now, quitDate));
    const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
    const theoreticalMaxSavings = weeksElapsed * unitsPerWeek * costPerUnit;
    const totalPuffsAllTime = journal.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
    const totalCostWastedAllTime = totalPuffsAllTime * costPerPuff;
    const totalMoneySaved = Math.max(0, theoreticalMaxSavings - totalCostWastedAllTime);
    // Rank Calculation (Based on last puff)
    const lastPuffTime = getLastPuffTime(journal, user.profile.quitDate);
    const secondsFreeForRank = Math.max(0, differenceInSeconds(now, lastPuffTime));
    // Weekly Consistency Data
    const weeklyConsistency = getWeeklyConsistency(journal, user.profile.dailyLimit || 0, user.createdAt);
    return {
      puffsToday,
      costWastedToday,
      nicotineUsedToday,
      projectedDailySavings,
      totalMoneySaved,
      dailyBaselineCost,
      weeklyConsistency,
      secondsElapsed,
      secondsFreeForRank,
      lastPuffTime
    };
  }, [user?.journal, user?.profile, now, user?.createdAt]);
  const handleQuickLog = async () => {
    if (isGuest) {
      toast.info("Sign in to log puffs");
      return;
    }
    if (!user) return;
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
  const hoursFree = secondsFreeForRank / 3600;
  const { current: currentRank } = getUserRank(hoursFree);
  const RankIcon = currentRank.icon;
  const streak = user.pledgeStreak || 0;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32 transition-colors duration-300">
      <MilestoneCelebration />
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 rounded-b-[40px] pt-8 pb-20 px-6 text-white shadow-lg shadow-violet-200/50 dark:shadow-none relative z-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-1 tracking-tight">Hello</h1>
              <p className="text-sky-100 font-medium uppercase tracking-wide text-sm opacity-90">
                {format(now, 'EEEE, MMMM d')}
              </p>
              {/* Badges Row */}
              <div className="mt-4 flex flex-wrap gap-2">
                {/* Rank Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <RankIcon className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    {currentRank.title}
                  </span>
                </div>
                {/* Streak Badge */}
                {streak > 0 && (
                  <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-400/30">
                    <Flame className="w-4 h-4 text-orange-300 fill-orange-400" />
                    <span className="text-xs font-bold text-white tracking-wide uppercase">
                      {streak} Day Streak
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {!isStandalone && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={promptInstall}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-200"
                  title="Install App"
                >
                  <Download className="w-5 h-5" />
                </Button>
              )}
              <ShareButton
                secondsFree={secondsFreeForRank}
                moneySaved={totalMoneySaved}
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
      </div>
      {/* Main Content - Overlapping Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 space-y-4 relative z-10">
        {/* Daily Pledge Button */}
        <DailyPledge />
        {/* Daily Tracker (Puff Count) */}
        <div className="mb-8">
          <DailyTracker
            puffsToday={puffsToday}
            costWasted={costWastedToday}
            nicotineUsed={nicotineUsedToday}
            projectedSavings={projectedDailySavings}
            currency={user.profile.currency}
            dailyLimit={user.profile.dailyLimit}
            onQuickLog={handleQuickLog}
          />
        </div>
        {/* Quote Carousel */}
        <QuoteCarousel />
        {/* Motivation Card */}
        <MotivationCard motivation={user.profile.motivation} />
        {/* Time Since Last Puff */}
        <TimeSinceLastPuff
          lastPuffTime={lastPuffTime}
          now={now}
        />
        {/* Breathing Card */}
        <BreathingCard />
        {/* Weekly Progress */}
        <WeeklyProgress data={weeklyConsistency} />
        {/* Hourly Chart */}
        <div className="w-full h-[250px] rounded-3xl min-w-0 overflow-hidden">
          <HourlyChart entries={user.journal} />
        </div>
        {/* Savings Goal Card (if configured) */}
        {user.profile.savingsGoal && user.profile.savingsGoal.cost > 0 && (
          <SavingsGoalCard
            savedAmount={totalMoneySaved}
            goal={user.profile.savingsGoal}
            currency={user.profile.currency}
          />
        )}
        {/* Savings Chart */}
        <div className="w-full h-[250px] rounded-3xl min-w-0 overflow-hidden">
          <SavingsChart
            currentSavings={totalMoneySaved}
            dailySavings={dailyBaselineCost}
            currency={user.profile.currency}
          />
        </div>
      </div>
      {/* Install Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Install Exhale</DialogTitle>
            <DialogDescription>
              Follow these steps to add the app to your home screen.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={isIOS ? "ios" : "android"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ios">iOS (Safari)</TabsTrigger>
              <TabsTrigger value="android">Android / Chrome</TabsTrigger>
            </TabsList>
            <TabsContent value="ios" className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <p className="text-sm">1. Tap the <strong>Share</strong> button in your browser menu bar.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <p className="text-sm">2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
              </div>
            </TabsContent>
            <TabsContent value="android" className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </div>
                <p className="text-sm">1. Tap the <strong>Menu</strong> (three dots) button in Chrome.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <p className="text-sm">2. Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}