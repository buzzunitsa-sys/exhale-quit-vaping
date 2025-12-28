import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RECOVERY_MILESTONES } from '@/data/recovery-milestones';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
interface NextMilestoneCardProps {
  secondsElapsed: number;
}
export function NextMilestoneCard({ secondsElapsed }: NextMilestoneCardProps) {
  // Find the first milestone that hasn't been achieved yet (duration > elapsed)
  const nextMilestone = RECOVERY_MILESTONES.find(m => m.durationSeconds > secondsElapsed);
  // If no next milestone is found, it means all have been achieved
  if (!nextMilestone) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-6"
      >
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 border-none shadow-lg text-white overflow-hidden relative">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
           <CardContent className="p-6 flex items-center gap-4 relative z-10">
             <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
               <CheckCircle2 className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-bold text-lg">All Milestones Achieved!</h3>
               <p className="text-emerald-100 text-sm">You are a legend. Keep living free.</p>
             </div>
           </CardContent>
        </Card>
      </motion.div>
    );
  }
  // Calculate progress towards this specific milestone
  // We measure progress from the *previous* milestone to this one
  const currentIndex = RECOVERY_MILESTONES.indexOf(nextMilestone);
  const prevMilestone = currentIndex > 0 ? RECOVERY_MILESTONES[currentIndex - 1] : null;
  const prevDuration = prevMilestone ? prevMilestone.durationSeconds : 0;
  const totalSegment = nextMilestone.durationSeconds - prevDuration;
  const elapsedInSegment = Math.max(0, secondsElapsed - prevDuration);
  const percent = Math.min(100, Math.max(0, (elapsedInSegment / totalSegment) * 100));
  // Calculate remaining time text
  const remainingSeconds = nextMilestone.durationSeconds - secondsElapsed;
  const rDays = Math.floor(remainingSeconds / (3600 * 24));
  const rHours = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
  const rMinutes = Math.floor((remainingSeconds % 3600) / 60);
  let timeText = "";
  if (rDays > 0) timeText = `${rDays}d ${rHours}h`;
  else if (rHours > 0) timeText = `${rHours}h ${rMinutes}m`;
  else timeText = `${Math.max(1, Math.floor(remainingSeconds / 60))}m`;
  const Icon = nextMilestone.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full mb-6"
    >
      <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-l-4 border-l-violet-500 overflow-hidden relative">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-0.5">Next Milestone</p>
                <h3 className="font-bold text-foreground text-lg leading-tight">{nextMilestone.title}</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-foreground tabular-nums">{percent.toFixed(0)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>In progress</span>
              <span>{timeText} remaining</span>
            </div>
            {/* Custom Progress Bar with Gradient */}
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}