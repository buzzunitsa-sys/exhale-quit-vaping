import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/use-haptic';
import { cn } from '@/lib/utils';
type Phase = 'inhale' | 'hold' | 'exhale';
const PHASES: Record<Phase, { duration: number; label: string; color: string; instruction: string }> = {
  inhale: { 
    duration: 4, 
    label: "Inhale", 
    color: "bg-sky-400",
    instruction: "Breathe in deeply through your nose..."
  },
  hold: { 
    duration: 7, 
    label: "Hold", 
    color: "bg-violet-400",
    instruction: "Hold your breath..."
  },
  exhale: { 
    duration: 8, 
    label: "Exhale", 
    color: "bg-emerald-400",
    instruction: "Exhale slowly through your mouth..."
  },
};
export function BreathingCircle() {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const { vibrate } = useHaptic();
  useEffect(() => {
    const { duration } = PHASES[phase];
    setTimeLeft(duration);
    // Haptic cue at start of phase
    if (phase === 'inhale') vibrate('medium');
    else if (phase === 'hold') vibrate('light');
    else vibrate('heavy');
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    const timeout = setTimeout(() => {
      if (phase === 'inhale') setPhase('hold');
      else if (phase === 'hold') setPhase('exhale');
      else setPhase('inhale');
    }, duration * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [phase, vibrate]);
  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* Outer Glow Ring */}
      <motion.div
        className={cn(
          "absolute w-64 h-64 rounded-full blur-3xl opacity-30 transition-colors duration-1000",
          phase === 'inhale' ? "bg-sky-500" :
          phase === 'hold' ? "bg-violet-500" : "bg-emerald-500"
        )}
        animate={{
          scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.6 : 1,
        }}
        transition={{ duration: PHASES[phase].duration, ease: "easeInOut" }}
      />
      {/* Main Breathing Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Track */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
        {/* Animated Circle */}
        <motion.div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center shadow-lg transition-colors duration-1000",
            PHASES[phase].color
          )}
          animate={{
            scale: phase === 'inhale' ? 1 : phase === 'hold' ? 1.05 : 0.5,
            opacity: phase === 'exhale' ? 0.8 : 1
          }}
          transition={{ duration: PHASES[phase].duration, ease: "easeInOut" }}
        >
          <div className="text-center text-white z-10">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-bold tracking-tight mb-1">{PHASES[phase].label}</span>
              <span className="text-5xl font-mono font-bold">{timeLeft}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Instructions */}
      <div className="mt-12 text-center h-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-muted-foreground"
          >
            {PHASES[phase].instruction}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}