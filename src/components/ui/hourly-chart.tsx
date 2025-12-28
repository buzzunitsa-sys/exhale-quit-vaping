import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import type { JournalEntry } from '@shared/types';
import { Clock } from 'lucide-react';
interface HourlyChartProps {
  entries?: JournalEntry[];
}
export function HourlyChart({ entries = [] }: HourlyChartProps) {
  const data = useMemo(() => {
    // Initialize 24 hours with 0 counts
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: i === 0 ? '12am' : i === 12 ? '12pm' : i > 12 ? `${i - 12}pm` : `${i}am`,
      val: 0
    }));
    // Aggregate counts
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const hour = date.getHours();
      if (hour >= 0 && hour < 24) {
        hours[hour].val += 1;
      }
    });
    return hours;
  }, [entries]);
  const hasData = entries.length > 0;
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          Hourly Overview
        </h3>
        {!hasData && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            No data yet
          </span>
        )}
      </div>
      <div className="h-48 w-full min-h-[200px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                interval={3} // Show every 4th label to avoid clutter
                tickFormatter={(hour) => hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
                dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-xl border border-slate-700">
                      <p className="font-bold mb-1">{d.label}</p>
                      <p>Cravings: <span className="font-bold text-sky-400">{d.val}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="val" radius={[4, 4, 4, 4]} barSize={8}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.val > 0 ? '#38bdf8' : '#f1f5f9'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!hasData && (
        <p className="text-center text-xs text-slate-400 mt-2">
          Log your cravings to see patterns here.
        </p>
      )}
    </div>
  );
}