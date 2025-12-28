import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/use-haptic';
import { cn } from '@/lib/utils';
type Phase = 'inhale' | 'hold' | 'exhale';
const PHASES: Record<Phase, { duration: number; label: string; color: string; instruction: string }> = {
  inhale: {
    duration: 4,
    label: "Inhale",
    color: "text-sky-400",
    instruction: "Breathe in deeply..."
  },
  hold: {
    duration: 7,
    label: "Hold",
    color: "text-violet-400",
    instruction: "Hold your breath..."
  },
  exhale: {
    duration: 8,
    label: "Exhale",
    color: "text-emerald-400",
    instruction: "Release slowly..."
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
  // Calculate progress for the ring
  const totalDuration = PHASES[phase].duration;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  // SVG Circle properties
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Ensure we have a valid number for initial render to avoid "undefined" animation warning
  const strokeDashoffset = circumference - (progress / 100) * circumference || circumference;
  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* Outer Glow Ring */}
      <motion.div
        className={cn(
          "absolute w-72 h-72 rounded-full blur-3xl opacity-30 transition-colors duration-1000",
          phase === 'inhale' ? "bg-sky-500" :
          phase === 'hold' ? "bg-violet-500" : "bg-emerald-500"
        )}
        animate={{
          scale: phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.5 : 1,
          opacity: phase === 'exhale' ? 0.2 : 0.4
        }}
        transition={{ duration: PHASES[phase].duration, ease: "easeInOut" }}
      />
      {/* Main Breathing Circle Container */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Progress Ring SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Progress Indicator */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            className={cn("transition-colors duration-500", PHASES[phase].color)}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        {/* Animated Inner Circle */}
        <motion.div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center shadow-2xl transition-colors duration-1000 z-10",
            phase === 'inhale' ? "bg-sky-500" :
            phase === 'hold' ? "bg-violet-500" : "bg-emerald-500"
          )}
          animate={{
            scale: phase === 'inhale' ? 0.85 : phase === 'hold' ? 0.9 : 0.4,
          }}
          transition={{ duration: PHASES[phase].duration, ease: "easeInOut" }}
        >
          <div className="text-center text-white z-20">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <span className="text-4xl font-bold tracking-tight mb-2 drop-shadow-md">{PHASES[phase].label}</span>
              <span className="text-6xl font-mono font-bold drop-shadow-md">{timeLeft}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Instructions */}
      <div className="mt-12 text-center h-20 px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-medium text-foreground leading-tight"
          >
            {PHASES[phase].instruction}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}