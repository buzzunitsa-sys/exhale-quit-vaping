import React from 'react';
import { Edit2, AlertTriangle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface PuffCounterProps {
  puffs: number; // Avoided
  nicotine: number; // Avoided
  limit?: number;
  puffsTaken?: number; // Actual slips today
  onQuickAdd?: () => void;
}
export function PuffCounter({ puffs, nicotine, limit = 0, puffsTaken = 0, onQuickAdd }: PuffCounterProps) {
  // Calculate progress based on some arbitrary max for visualization if limit is 0
  const progress = limit > 0 ? Math.min((puffs / limit) * 100, 100) : 5;
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm transition-colors duration-300 relative overflow-hidden">
      {puffsTaken > 0 && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/10 border-b border-red-500/20 py-1 px-4 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3 h-3 text-red-500" />
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            {puffsTaken} SLIPS TODAY
          </span>
        </div>
      )}
      <h3 className={cn("text-center font-semibold text-foreground mb-6 text-lg", puffsTaken > 0 && "mt-4")}>
        Puffs Avoided
      </h3>
      <div className="flex justify-between items-end mb-6 px-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-1">{Math.floor(puffs)}</div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">PUFFS</div>
        </div>
        <div className="text-center pb-1">
          <div className="text-xl font-medium text-yellow-500 mb-1">{nicotine.toFixed(1)} mg</div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">NICOTINE</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
           <div
             className="h-full bg-sky-400 rounded-full transition-all duration-1000"
             style={{ width: `${progress}%` }}
           />
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 border-t border-border pt-4">
          <span className="font-medium tracking-wider">DAILY LIMIT (GOAL)</span>
          <div className="flex items-center gap-2">
            <span>{limit}</span>
            <Edit2 className="w-3 h-3 cursor-pointer hover:text-foreground" />
          </div>
        </div>
      </div>
      {onQuickAdd && (
        <div className="mt-6 pt-4 border-t border-border flex justify-center">
             <Button
                onClick={onQuickAdd}
                variant="outline"
                className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20 dark:text-red-400 text-red-500 gap-2"
              >
                <Plus className="w-4 h-4" />
                Quick Log (+1 Puff)
              </Button>
        </div>
      )}
    </div>
  );
}