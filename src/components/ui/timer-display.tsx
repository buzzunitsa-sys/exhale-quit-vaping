import React from 'react';
import { cn } from '@/lib/utils';
interface TimerDisplayProps {
  secondsElapsed: number;
}
export function TimerDisplay({ secondsElapsed }: TimerDisplayProps) {
  const days = Math.floor(secondsElapsed / (3600 * 24));
  const hours = Math.floor((secondsElapsed % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = Math.floor(secondsElapsed % 60);
  const format = (num: number) => num.toString().padStart(2, '0').split('');
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h3 className="text-center font-semibold text-slate-800 mb-6 text-lg">Time since last puff</h3>
      <div className="flex justify-between items-start gap-2 px-1 sm:px-4">
        <TimeUnit label="DAYS" digits={format(days)} />
        <TimeUnit label="HOURS" digits={format(hours)} />
        <TimeUnit label="MINUTES" digits={format(minutes)} />
        <TimeUnit label="SECONDS" digits={format(seconds)} />
      </div>
    </div>
  );
}
function TimeUnit({ label, digits }: { label: string, digits: string[] }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {digits.map((d, i) => (
          <div key={i} className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-500/90 text-white rounded-md flex items-center justify-center text-xl font-bold shadow-sm">
            {d}
          </div>
        ))}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}