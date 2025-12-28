import { 
  startOfWeek, 
  format, 
  subDays, 
  subWeeks, 
  subMonths, 
  isSameDay, 
  isSameWeek, 
  isSameMonth, 
  eachDayOfInterval, 
  eachWeekOfInterval, 
  eachMonthOfInterval 
} from 'date-fns';
import type { JournalEntry } from '@shared/types';
export type TimeRange = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export interface ChartDataPoint {
  name: string;
  puffs: number;
  average: number;
  fullDate: string;
}
export interface SummaryStats {
  totalPuffs: number;
  dailyAverage: number;
  daysWithSmoke: number;
  daysNoSmoke: number;
}
export function getChartData(entries: JournalEntry[], range: TimeRange): ChartDataPoint[] {
  const now = new Date();
  let dataPoints: ChartDataPoint[] = [];
  if (range === 'DAILY') {
    // Last 7 days
    const start = subDays(now, 6);
    const interval = eachDayOfInterval({ start, end: now });
    dataPoints = interval.map(date => {
      const dayEntries = entries.filter(e => isSameDay(e.timestamp, date));
      return {
        name: format(date, 'EEE'), // Mon, Tue
        fullDate: format(date, 'MMM d, yyyy'),
        puffs: dayEntries.length,
        average: 0 // Placeholder for now
      };
    });
  } else if (range === 'WEEKLY') {
    // Last 8 weeks
    const start = subWeeks(now, 7);
    const interval = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 1 });
    dataPoints = interval.map(date => {
      const weekEntries = entries.filter(e => isSameWeek(e.timestamp, date, { weekStartsOn: 1 }));
      return {
        name: `W${format(date, 'w')}`,
        fullDate: `Week of ${format(date, 'MMM d')}`,
        puffs: weekEntries.length,
        average: 0
      };
    });
  } else {
    // Last 6 months
    const start = subMonths(now, 5);
    const interval = eachMonthOfInterval({ start, end: now });
    dataPoints = interval.map(date => {
      const monthEntries = entries.filter(e => isSameMonth(e.timestamp, date));
      return {
        name: format(date, 'MMM'),
        fullDate: format(date, 'MMMM yyyy'),
        puffs: monthEntries.length,
        average: 0
      };
    });
  }
  // Calculate moving average (simple version: average of all visible points)
  // Avoid division by zero
  const totalPuffs = dataPoints.reduce((acc, curr) => acc + curr.puffs, 0);
  const overallAvg = dataPoints.length > 0 ? Math.round(totalPuffs / dataPoints.length) : 0;
  return dataPoints.map(p => ({ ...p, average: overallAvg }));
}
export function getSummaryStats(entries: JournalEntry[]): SummaryStats {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
  // Filter entries for this week
  const thisWeekEntries = entries.filter(e => e.timestamp >= startOfCurrentWeek.getTime());
  const totalPuffs = thisWeekEntries.length;
  // Calculate days passed in this week (1-7)
  // getDay(): Sun=0, Mon=1... Sat=6. 
  // If Mon(1): (1+6)%7 + 1 = 1. If Sun(0): (0+6)%7 + 1 = 7.
  const daysPassed = Math.max(1, (now.getDay() + 6) % 7 + 1);
  const dailyAverage = Math.round(totalPuffs / daysPassed);
  // Count unique days with smoke in this week
  const uniqueDays = new Set(thisWeekEntries.map(e => format(e.timestamp, 'yyyy-MM-dd'))).size;
  return {
    totalPuffs,
    dailyAverage,
    daysWithSmoke: uniqueDays,
    daysNoSmoke: daysPassed - uniqueDays
  };
}