import React from 'react';
import { Edit2 } from 'lucide-react';
interface PuffCounterProps {
  puffs: number;
  nicotine: number;
  limit?: number;
}
export function PuffCounter({ puffs, nicotine, limit = 0 }: PuffCounterProps) {
  // Calculate progress based on some arbitrary max for visualization if limit is 0
  const progress = limit > 0 ? Math.min((puffs / limit) * 100, 100) : 5;
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h3 className="text-center font-semibold text-slate-800 mb-6 text-lg">Puffs Avoided</h3>
      <div className="flex justify-between items-end mb-6 px-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-700 mb-1">{Math.floor(puffs)}</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">PUFFS</div>
        </div>
        <div className="text-center pb-1">
          <div className="text-xl font-medium text-yellow-500 mb-1">{nicotine.toFixed(1)} mg</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">NICOTINE</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
           <div 
             className="h-full bg-sky-400 rounded-full transition-all duration-1000" 
             style={{ width: `${progress}%` }} 
           /> 
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 mt-4 border-t pt-4 border-slate-50">
          <span className="font-medium tracking-wider">DAILY LIMIT (GOAL)</span>
          <div className="flex items-center gap-2">
            <span>{limit}</span>
            <Edit2 className="w-3 h-3 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}