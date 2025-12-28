import React, { useRef, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
export function DateStrip() {
  const today = new Date();
  // Show a 2-week window centered roughly on today or just this week
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const days = Array.from({ length: 14 }, (_, i) => addDays(start, i - 3)); // Start a bit before
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      // Center the scroll on today
      const todayEl = scrollRef.current.querySelector('[data-today="true"]');
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, []);
  return (
    <div 
      ref={scrollRef}
      className="flex items-center overflow-x-auto pb-4 pt-2 px-4 gap-3 no-scrollbar snap-x"
    >
      {days.map((date) => {
        const isToday = isSameDay(date, today);
        return (
          <div
            key={date.toString()}
            data-today={isToday}
            className={cn(
              "flex flex-col items-center justify-center min-w-[3.5rem] h-20 rounded-2xl transition-all snap-center shrink-0",
              isToday 
                ? "bg-white/20 backdrop-blur-md text-white shadow-sm border border-white/30" 
                : "text-white/60 hover:bg-white/10"
            )}
          >
            <span className="text-xs font-medium mb-1">{format(date, 'EEE')}</span>
            <span className={cn("text-lg font-bold", isToday && "text-white")}>{format(date, 'd')}</span>
          </div>
        );
      })}
    </div>
  );
}