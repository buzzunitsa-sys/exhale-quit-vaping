import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useHaptic } from '@/hooks/use-haptic';
export function BreathingCard() {
  const { vibrate } = useHaptic();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full mb-4"
    >
      <Link to="/breathe" onClick={() => vibrate('medium')}>
        <Card className="bg-gradient-to-r from-sky-400 to-teal-400 border-none shadow-lg shadow-sky-500/20 overflow-hidden relative group cursor-pointer transition-transform active:scale-[0.98]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-200/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
          <CardContent className="p-6 relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Feeling Stressed?</h3>
                <p className="text-sky-50 text-sm font-medium opacity-90">Take a moment to breathe.</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}