import React, { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Trophy, Heart } from 'lucide-react';
import { RANKS, getUserRank } from '@/lib/ranks';
import { RECOVERY_MILESTONES } from '@/data/recovery-milestones';
import { ACHIEVEMENTS } from '@/lib/achievements';
type CelebrationType = 'rank' | 'health' | 'achievement';
interface CelebrationItem {
  id: string;
  type: CelebrationType;
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}
export function MilestoneCelebration() {
  const user = useAppStore(s => s.user);
  const [queue, setQueue] = useState<CelebrationItem[]>([]);
  const [current, setCurrent] = useState<CelebrationItem | null>(null);
  // Calculate stats
  const stats = useMemo(() => {
    if (!user?.profile) return null;
    const now = new Date();
    const quitDate = new Date(user.profile.quitDate);
    const secondsElapsed = Math.max(0, differenceInSeconds(now, quitDate));
    const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
    const moneySaved = weeksElapsed * user.profile.unitsPerWeek * user.profile.costPerUnit;
    const podsAvoided = Math.floor(weeksElapsed * user.profile.unitsPerWeek);
    const journal = user.journal || [];
    const todayEntries = journal.filter(entry => isSameDay(entry.timestamp, now));
    const puffsToday = todayEntries.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
    const dailyLimit = user.profile.dailyLimit || 0;
    return { secondsElapsed, moneySaved, podsAvoided, dailyLimit, puffsToday, journal };
  }, [user]);
  // Check for new milestones
  useEffect(() => {
    if (!stats || !user) return;
    const newItems: CelebrationItem[] = [];
    // 1. Check Ranks
    const hoursFree = stats.secondsElapsed / 3600;
    const { current: currentRank } = getUserRank(hoursFree);
    const lastSeenRankId = localStorage.getItem(`exhale_seen_rank_${user.id}`);
    // Find index of current rank and last seen rank
    const currentRankIndex = RANKS.findIndex(r => r.id === currentRank.id);
    const lastSeenRankIndex = lastSeenRankId ? RANKS.findIndex(r => r.id === lastSeenRankId) : -1;
    if (currentRankIndex > lastSeenRankIndex) {
      // User has leveled up!
      newItems.push({
        id: currentRank.id,
        type: 'rank',
        title: `New Rank: ${currentRank.title}`,
        description: currentRank.description,
        icon: <currentRank.icon className="w-12 h-12 text-yellow-400" />,
        color: 'bg-yellow-500'
      });
    }
    // 2. Check Health Milestones
    const seenMilestones = JSON.parse(localStorage.getItem(`exhale_seen_milestones_${user.id}`) || '[]');
    const unlockedMilestones = RECOVERY_MILESTONES.filter(m => stats.secondsElapsed >= m.durationSeconds);
    unlockedMilestones.forEach(m => {
      if (!seenMilestones.includes(m.id)) {
        newItems.push({
          id: m.id,
          type: 'health',
          title: 'Health Milestone Reached!',
          description: m.title, // Use title as description for the card
          icon: <Heart className="w-12 h-12 text-red-500" />,
          color: 'bg-red-500'
        });
      }
    });
    // 3. Check Achievements
    const seenAchievements = JSON.parse(localStorage.getItem(`exhale_seen_achievements_${user.id}`) || '[]');
    const unlockedAchievements = ACHIEVEMENTS.filter(a => a.condition({
      secondsFree: stats.secondsElapsed,
      moneySaved: stats.moneySaved,
      podsAvoided: stats.podsAvoided,
      dailyLimit: stats.dailyLimit,
      puffsToday: stats.puffsToday,
      journal: stats.journal
    }));
    unlockedAchievements.forEach(a => {
      if (!seenAchievements.includes(a.id)) {
        newItems.push({
          id: a.id,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          description: a.title,
          icon: <Trophy className="w-12 h-12 text-violet-500" />,
          color: 'bg-violet-500'
        });
      }
    });
    // Only update queue if we found new items that aren't already in the queue or current
    if (newItems.length > 0) {
      setQueue(prev => {
        const existingIds = new Set([...prev.map(i => i.id), current?.id]);
        const uniqueNewItems = newItems.filter(i => !existingIds.has(i.id));
        return [...prev, ...uniqueNewItems];
      });
    }
  }, [stats, user, current?.id]);
  // Process Queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      const next = queue[0];
      setCurrent(next);
      setQueue(prev => prev.slice(1));
      // Trigger Confetti
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: next.type === 'rank' ? ['#fbbf24', '#f59e0b'] :
                 next.type === 'health' ? ['#ef4444', '#f87171'] :
                 ['#8b5cf6', '#a78bfa']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: next.type === 'rank' ? ['#fbbf24', '#f59e0b'] :
                 next.type === 'health' ? ['#ef4444', '#f87171'] :
                 ['#8b5cf6', '#a78bfa']
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [queue, current]);
  const handleDismiss = () => {
    if (!current || !user) return;
    // Mark as seen in localStorage
    if (current.type === 'rank') {
      localStorage.setItem(`exhale_seen_rank_${user.id}`, current.id);
    } else if (current.type === 'health') {
      const seen = JSON.parse(localStorage.getItem(`exhale_seen_milestones_${user.id}`) || '[]');
      localStorage.setItem(`exhale_seen_milestones_${user.id}`, JSON.stringify([...seen, current.id]));
    } else if (current.type === 'achievement') {
      const seen = JSON.parse(localStorage.getItem(`exhale_seen_achievements_${user.id}`) || '[]');
      localStorage.setItem(`exhale_seen_achievements_${user.id}`, JSON.stringify([...seen, current.id]));
    }
    setCurrent(null);
  };
  if (!current) return null;
  return (
    <AnimatePresence>
      <Dialog open={!!current} onOpenChange={(open) => !open && handleDismiss()}>
        <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none p-0 flex items-center justify-center" aria-describedby="celebration-desc">
          <DialogTitle className="sr-only">{current.title}</DialogTitle>
          <DialogDescription className="sr-only">{current.description}</DialogDescription>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="bg-card w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-20 ${current.color}`} />
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm shadow-lg ring-4 ring-white/20">
                {current.icon}
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {current.title}
              </h2>
              <p id="celebration-desc" className="text-muted-foreground mb-8 text-lg leading-relaxed">
                {current.description}
              </p>
              <Button
                onClick={handleDismiss}
                className={`w-full h-12 text-lg font-bold text-white shadow-lg transition-transform active:scale-95 ${current.color?.replace('bg-', 'bg-gradient-to-r from-').replace('500', '500 to-white/20') || 'bg-primary'}`}
              >
                Awesome!
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}