import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { differenceInSeconds, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Trophy, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { ShareButton } from '@/components/ui/share-button';
import { Button } from '@/components/ui/button';
import { CertificateModal } from '@/components/CertificateModal';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types/app';
// Define which achievements get a certificate
const MAJOR_MILESTONES = [
  '1week', '2weeks', '1month', '3months', '6months', '1year', // Time
  'save100', 'save500', 'save1000', // Money
  'commitment' // First step
];
export function AchievementsPage() {
  const user = useAppStore(s => s.user);
  const [now, setNow] = useState(new Date());
  const [selectedCertificate, setSelectedCertificate] = useState<Achievement | null>(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Safe calculation of stats even if user is not fully loaded yet
  const quitDate = user?.profile ? new Date(user.profile.quitDate) : new Date();
  const secondsElapsed = differenceInSeconds(now, quitDate);
  const weeksElapsed = secondsElapsed / (60 * 60 * 24 * 7);
  const moneySaved = user?.profile ? weeksElapsed * user.profile.unitsPerWeek * user.profile.costPerUnit : 0;
  const podsAvoided = user?.profile ? Math.floor(weeksElapsed * user.profile.unitsPerWeek) : 0;
  // Calculate puffs today for taper achievement
  const journal = user?.journal || [];
  const todayEntries = journal.filter(entry => isSameDay(entry.timestamp, now));
  const puffsToday = todayEntries.reduce((sum, entry) => sum + (entry.puffs || 0), 0);
  const dailyLimit = user?.profile?.dailyLimit || 0;
  const stats = {
    secondsFree: secondsElapsed,
    moneySaved,
    podsAvoided,
    dailyLimit,
    puffsToday,
    journal,
    userCreatedAt: user?.createdAt
  };
  const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(stats)).length;
  if (!user?.profile) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-24 transition-colors duration-300">
      <PageHeader 
        title="Achievements" 
        subtitle="Your trophy case of freedom."
        rightElement={
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-center">
              <span className="block text-2xl font-bold text-white leading-none">
                  {unlockedCount}
              </span>
              <span className="text-[10px] font-medium text-sky-100 uppercase tracking-wider">
                  UNLOCKED
              </span>
            </div>
            <ShareButton 
              customTitle="My Exhale Achievements"
              customText={`I've unlocked ${unlockedCount} achievements on Exhale! 🏆 #QuitVaping #ExhaleApp`}
              className="h-12 w-12 rounded-2xl"
            />
          </div>
        }
      />
      <div className="px-4 grid grid-cols-2 gap-4 relative z-10">
        {ACHIEVEMENTS.map((achievement, index) => {
          const isUnlocked = achievement.condition(stats);
          const hasCertificate = MAJOR_MILESTONES.includes(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { scale: 1.03 } : {}}
            >
              <Card className={cn(
                "h-full border-none shadow-sm transition-all duration-300 relative overflow-hidden flex flex-col",
                isUnlocked 
                  ? "bg-card dark:bg-card border border-sky-100 dark:border-sky-900 shadow-md" 
                  : "bg-slate-100 dark:bg-muted/50 opacity-70 grayscale"
              )}>
                {/* Shimmer effect for unlocked cards */}
                {isUnlocked && (
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />
                )}
                <CardContent className="p-5 flex flex-col items-center text-center gap-3 flex-1 relative z-20">
                  <div className={cn(
                    "p-3 rounded-full transition-all duration-500",
                    isUnlocked 
                      ? "bg-gradient-to-br from-sky-400 to-violet-500 text-white shadow-lg shadow-violet-500/30 scale-110" 
                      : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                  )}>
                    {isUnlocked ? achievement.icon : <Trophy className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className={cn(
                      "font-semibold mb-1 text-sm sm:text-base",
                      isUnlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {achievement.description}
                    </p>
                  </div>
                  {/* Certificate Button */}
                  {isUnlocked && hasCertificate && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCertificate(achievement)}
                      className="mt-2 h-8 text-xs gap-1.5 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 w-full"
                    >
                      <FileText className="w-3 h-3" />
                      Certificate
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          title={selectedCertificate.title}
          description={selectedCertificate.description}
          date={now} // Ideally this would be the actual unlock date, but 'now' works for MVP
          userName={user?.email?.split('@')[0]} // Simple username fallback
        />
      )}
    </div>
  );
}