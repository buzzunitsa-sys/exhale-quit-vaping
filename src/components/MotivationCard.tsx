import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
interface MotivationCardProps {
  motivation?: string;
}
export function MotivationCard({ motivation }: MotivationCardProps) {
  if (!motivation) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full mb-6"
    >
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-100 dark:border-pink-900/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Quote className="w-16 h-16 text-pink-500 rotate-12" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-2">
                My Why
              </h3>
              <p className="text-lg font-medium text-foreground italic leading-relaxed">
                "{motivation}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}