import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SavingsGoal } from '@shared/types';
interface SavingsGoalCardProps {
  savedAmount: number;
  goal: SavingsGoal;
  currency: string;
}
export function SavingsGoalCard({ savedAmount, goal, currency }: SavingsGoalCardProps) {
  const progress = Math.min(100, Math.max(0, (savedAmount / goal.cost) * 100));
  const isCompleted = progress >= 100;
  // const remaining = Math.max(0, goal.cost - savedAmount); // Unused but kept for logic reference
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full mb-4"
    >
      <Card className={cn(
        "border-none shadow-lg overflow-hidden relative transition-all duration-500",
        isCompleted
          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
          : "bg-gradient-to-br from-indigo-500 to-purple-600"
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <CardContent className="p-6 relative z-10 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isCompleted ? (
                  <Trophy className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
                ) : (
                  <Target className="w-5 h-5 text-indigo-200" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                  {isCompleted ? "GOAL ACHIEVED!" : "SAVINGS GOAL"}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{goal.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {progress.toFixed(0)}%
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-3 bg-black/20 rounded-full overflow-hidden mb-4 backdrop-blur-sm">
            <motion.div
              className={cn(
                "h-full rounded-full shadow-lg",
                isCompleted ? "bg-white" : "bg-gradient-to-r from-sky-300 to-indigo-300"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-end text-sm">
            <div>
              <p className="text-indigo-100 text-xs mb-0.5">Saved</p>
              <p className="font-bold text-lg">
                {currency === 'USD' ? '$' : currency + ' '}
                {savedAmount.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-xs mb-0.5">Goal</p>
              <p className="font-bold text-lg opacity-90">
                {currency === 'USD' ? '$' : currency + ' '}
                {goal.cost.toFixed(2)}
              </p>
            </div>
          </div>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-emerald-600 px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 whitespace-nowrap"
            >
              <CheckCircle2 className="w-5 h-5" />
              You did it!
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}