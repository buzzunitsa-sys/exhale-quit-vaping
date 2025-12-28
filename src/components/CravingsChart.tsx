import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import type { JournalEntry } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
interface CravingsChartProps {
  entries: JournalEntry[];
}
export function CravingsChart({ entries }: CravingsChartProps) {
  const data = useMemo(() => {
    // Sort entries by timestamp ascending
    const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    // Take last 14 entries to keep chart readable
    const recent = sorted.slice(-14);
    return recent.map(entry => ({
      date: format(entry.timestamp, 'MMM d'),
      time: format(entry.timestamp, 'h:mm a'),
      intensity: entry.intensity,
      trigger: entry.trigger,
      fullDate: format(entry.timestamp, 'PP p')
    }));
  }, [entries]);
  if (entries.length === 0) return null;
  return (
    <Card className="bg-card border border-border/50 shadow-sm transition-colors duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Activity className="w-5 h-5 text-emerald-500" />
          Recent Cravings Intensity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-2 min-h-[200px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                hide 
                domain={[0, 10]}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-xl border border-border">
                        <p className="font-bold mb-1">{d.fullDate}</p>
                        <p>Intensity: <span className="font-bold text-emerald-400">{d.intensity}/10</span></p>
                        <p className="text-muted-foreground">Trigger: {d.trigger}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.intensity > 7 ? '#ef4444' : entry.intensity > 4 ? '#f97316' : '#10b981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}