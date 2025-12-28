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
  eachMonthOfInterval,
  startOfDay,
  isAfter
} from 'date-fns';
import type { JournalEntry } from '@shared/types';
export type TimeRange = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export interface ChartDataPoint {
  name: string;
  puffs: number; // Cravings Logged
  puffsTaken: number; // Actual puffs from slips
  average: number;
  fullDate: string;
}
export interface SummaryStats {
  totalPuffs: number;
  actualPuffs: number;
  dailyAverage: number;
  daysWithSmoke: number;
  daysNoSmoke: number;
}
export type DayStatus = 'clean' | 'under-limit' | 'over-limit' | 'unknown';
export interface DailyConsistency {
  date: Date;
  status: DayStatus;
  puffs: number;
  limit: number;
  label: string;
  fullDate: string;
}
export interface TriggerDataPoint {
  name: string;
  value: number;
  percentage: number;
  fill: string;
  [key: string]: any;
}
/**
 * Calculates the timestamp of the last puff taken.
 * If no puffs have been taken since the quit date, returns the quit date timestamp.
 * This ensures the "Time Free" counter resets accurately on slips.
 */
export function getLastPuffTime(journal: JournalEntry[], quitDateStr: string): number {
  const quitDateTs = new Date(quitDateStr).getTime();
  // Find all entries with actual puffs (slips)
  const slips = journal.filter(e => (e.puffs || 0) > 0);
  if (slips.length === 0) {
    return quitDateTs;
  }
  // Find the most recent slip
  const lastSlipTs = Math.max(...slips.map(e => e.timestamp));
  // If the last slip was BEFORE the quit date (e.g. historical data), ignore it
  // Otherwise, use the slip time as the new "start" time for the counter
  return Math.max(quitDateTs, lastSlipTs);
}
/**
 * Filters journal entries based on the selected time range.
 * DAILY: Last 7 days
 * WEEKLY: Last 8 weeks
 * MONTHLY: Last 6 months
 */
export function filterEntriesByRange(entries: JournalEntry[], range: TimeRange): JournalEntry[] {
  const now = new Date();
  let startDate: Date;
  switch (range) {
    case 'DAILY':
      startDate = subDays(now, 7);
      break;
    case 'WEEKLY':
      startDate = subWeeks(now, 8);
      break;
    case 'MONTHLY':
      startDate = subMonths(now, 6);
      break;
    default:
      startDate = subDays(now, 7);
  }
  // Filter entries that are after the start date
  return entries.filter(entry => isAfter(entry.timestamp, startDate));
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
        average: 0 // Placeholder, filled below
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
  // Calculate moving average of cravings (simple version: average of the displayed period)
  const totalCravings = dataPoints.reduce((acc, curr) => acc + curr.puffs, 0);
  const overallAvg = dataPoints.length > 0 ? Math.round(totalCravings / dataPoints.length) : 0;
  // Apply average to all points (could be enhanced to be a rolling average in future)
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
export function getWeeklyConsistency(entries: JournalEntry[], dailyLimit: number = 0, userCreatedAt?: number): DailyConsistency[] {
  const end = new Date();
  const start = subDays(end, 6); // Last 7 days including today
  const days = eachDayOfInterval({ start, end });
  const userStartDate = userCreatedAt ? startOfDay(userCreatedAt) : null;
  return days.map(day => {
    // If the day is before the user started, mark as unknown
    if (userStartDate && day < userStartDate) {
      return {
        date: day,
        status: 'unknown',
        puffs: 0,
        limit: dailyLimit,
        label: format(day, 'EEEEE'),
        fullDate: format(day, 'MMM d')
      };
    }
    const dayEntries = entries.filter(e => isSameDay(e.timestamp, day));
    const puffs = dayEntries.reduce((sum, e) => sum + (e.puffs || 0), 0);
    let status: DayStatus = 'unknown';
    if (puffs === 0) {
      status = 'clean';
    } else {
      if (dailyLimit > 0) {
        status = puffs <= dailyLimit ? 'under-limit' : 'over-limit';
      } else {
        // If no limit is set, any smoking is technically "over" the ideal of 0,
        // but we'll mark it as over-limit to indicate usage.
        status = 'over-limit';
      }
    }
    return {
      date: day,
      status,
      puffs,
      limit: dailyLimit,
      label: format(day, 'EEEEE'), // M, T, W...
      fullDate: format(day, 'MMM d')
    };
  });
}
// Color mapping for common triggers
const TRIGGER_COLORS: Record<string, string> = {
  "Stress": "#f43f5e", // Rose 500
  "Boredom": "#0ea5e9", // Sky 500
  "Social Pressure": "#8b5cf6", // Violet 500
  "Habit/Routine": "#f59e0b", // Amber 500
  "Alcohol": "#eab308", // Yellow 500
  "Coffee": "#78716c", // Stone 500
  "After Meal": "#10b981", // Emerald 500
  "Other": "#64748b", // Slate 500
  "Quick Log": "#94a3b8" // Slate 400
};
const DEFAULT_COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#64748b"];
export function getTriggerDistribution(entries: JournalEntry[]): TriggerDataPoint[] {
  if (!entries || entries.length === 0) return [];
  const counts: Record<string, number> = {};
  let total = 0;
  entries.forEach(entry => {
    const trigger = entry.trigger || "Other";
    counts[trigger] = (counts[trigger] || 0) + 1;
    total++;
  });
  return Object.entries(counts)
    .map(([name, value], index) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100),
      fill: TRIGGER_COLORS[name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    }))
    .sort((a, b) => b.value - a.value); // Sort by count descending
}