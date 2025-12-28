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
  puffs: number; // This is actually "Cravings Logged" in the UI context usually, but let's keep name for compat
  puffsTaken: number; // Actual puffs from slips
  average: number;
  fullDate: string;
}
export interface SummaryStats {
  totalPuffs: number; // Total cravings logged
  actualPuffs: number; // Total actual puffs taken (slips)
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
      const puffsTaken = dayEntries.reduce((sum, e) => sum + (e.puffs || 0), 0);
      return {
        name: format(date, 'EEE'), // Mon, Tue
        fullDate: format(date, 'MMM d, yyyy'),
        puffs: dayEntries.length, // Count of craving entries
        puffsTaken,
        average: 0 // Placeholder
      };
    });
  } else if (range === 'WEEKLY') {
    // Last 8 weeks
    const start = subWeeks(now, 7);
    const interval = eachWeekOfInterval({ start, end: now }, { weekStartsOn: 1 });
    dataPoints = interval.map(date => {
      const weekEntries = entries.filter(e => isSameWeek(e.timestamp, date, { weekStartsOn: 1 }));
      const puffsTaken = weekEntries.reduce((sum, e) => sum + (e.puffs || 0), 0);
      return {
        name: `W${format(date, 'w')}`,
        fullDate: `Week of ${format(date, 'MMM d')}`,
        puffs: weekEntries.length,
        puffsTaken,
        average: 0
      };
    });
  } else {
    // Last 6 months
    const start = subMonths(now, 5);
    const interval = eachMonthOfInterval({ start, end: now });
    dataPoints = interval.map(date => {
      const monthEntries = entries.filter(e => isSameMonth(e.timestamp, date));
      const puffsTaken = monthEntries.reduce((sum, e) => sum + (e.puffs || 0), 0);
      return {
        name: format(date, 'MMM'),
        fullDate: format(date, 'MMMM yyyy'),
        puffs: monthEntries.length,
        puffsTaken,
        average: 0
      };
    });
  }
  // Calculate moving average of cravings (simple version)
  const totalCravings = dataPoints.reduce((acc, curr) => acc + curr.puffs, 0);
  const overallAvg = dataPoints.length > 0 ? Math.round(totalCravings / dataPoints.length) : 0;
  return dataPoints.map(p => ({ ...p, average: overallAvg }));
}
export function getSummaryStats(entries: JournalEntry[]): SummaryStats {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
  // Filter entries for this week
  const thisWeekEntries = entries.filter(e => e.timestamp >= startOfCurrentWeek.getTime());
  const totalPuffs = thisWeekEntries.length; // Total cravings
  const actualPuffs = thisWeekEntries.reduce((sum, e) => sum + (e.puffs || 0), 0); // Actual puffs taken
  // Calculate days passed in this week (1-7)
  const daysPassed = Math.max(1, (now.getDay() + 6) % 7 + 1);
  const dailyAverage = Math.round(totalPuffs / daysPassed);
  // Count unique days with smoke (where puffs > 0)
  // If we just want days with ANY entry, use thisWeekEntries.
  // But "days with smoke" implies slips. Let's count days with slips.
  const daysWithSlips = new Set(
    thisWeekEntries
      .filter(e => (e.puffs || 0) > 0)
      .map(e => format(e.timestamp, 'yyyy-MM-dd'))
  ).size;
  return {
    totalPuffs,
    actualPuffs,
    dailyAverage,
    daysWithSmoke: daysWithSlips,
    daysNoSmoke: daysPassed - daysWithSlips
  };
}