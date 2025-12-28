import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek,
  isAfter,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Check, X, Circle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { JournalEntry } from '@shared/types';
interface HistoryCalendarProps {
  entries: JournalEntry[];
  dailyLimit?: number;
  createdAt: number;
}
type DayStatus = 'clean' | 'under-limit' | 'over-limit' | 'unknown' | 'future';
export function HistoryCalendar({ entries, dailyLimit = 0, createdAt }: HistoryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());
  const userStartDate = startOfDay(new Date(createdAt));
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    return calendarDays.map(day => {
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isFuture = isAfter(day, today);
      const isBeforeStart = isAfter(userStartDate, day);
      // Calculate stats for this day
      const dayEntries = entries.filter(e => isSameDay(e.timestamp, day));
      const puffs = dayEntries.reduce((sum, e) => sum + (e.puffs || 0), 0);
      let status: DayStatus = 'unknown';
      if (isFuture) {
        status = 'future';
      } else if (isBeforeStart) {
        status = 'unknown';
      } else if (puffs === 0) {
        status = 'clean';
      } else {
        if (dailyLimit > 0) {
          status = puffs <= dailyLimit ? 'under-limit' : 'over-limit';
        } else {
          status = 'over-limit'; // Any usage is "over" if no limit, or just tracked
        }
      }
      return {
        date: day,
        isCurrentMonth,
        status,
        puffs
      };
    });
  }, [currentMonth, entries, dailyLimit, today, userStartDate]);
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  return (
    <Card className="bg-card border border-border/50 shadow-sm transition-colors duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">History</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextMonth} 
              disabled={isSameMonth(currentMonth, today) || isAfter(currentMonth, today)}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          <TooltipProvider delayDuration={100}>
            {days.map((day, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all cursor-default border",
                      !day.isCurrentMonth && "opacity-30 grayscale",
                      day.status === 'future' 
                        ? "bg-secondary/30 border-transparent text-muted-foreground/30"
                        : day.status === 'unknown'
                        ? "bg-secondary/50 border-transparent text-muted-foreground/50"
                        : day.status === 'clean'
                        ? "bg-emerald-500 border-emerald-600 text-white shadow-sm"
                        : day.status === 'under-limit'
                        ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                    )}
                  >
                    <span className="text-xs font-medium z-10">{format(day.date, 'd')}</span>
                    {/* Status Icon (Optional, for larger screens or just color) */}
                    {day.status === 'clean' && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Check className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <div className="text-center">
                    <p className="font-bold mb-1">{format(day.date, 'PP')}</p>
                    {day.status === 'future' ? (
                      <p className="text-muted-foreground">Future</p>
                    ) : day.status === 'unknown' ? (
                      <p className="text-muted-foreground">Before Start</p>
                    ) : (
                      <>
                        <p>{day.status === 'clean' ? 'Smoke Free!' : `${day.puffs} puffs`}</p>
                        {dailyLimit > 0 && day.status !== 'clean' && (
                          <p className="opacity-80">Limit: {dailyLimit}</p>
                        )}
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Clean</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" />
            <span>Under Limit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800" />
            <span>Over Limit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}