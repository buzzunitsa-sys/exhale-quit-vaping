import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TriggerDataPoint } from '@/lib/stats-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
interface TriggerChartProps {
  data: TriggerDataPoint[];
}
export function TriggerChart({ data }: TriggerChartProps) {
  if (!data || data.length === 0) return null;
  return (
    <Card className="bg-card text-card-foreground border-border shadow-sm transition-colors duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Trigger Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-2 min-h-[250px] min-w-0">
          {/* Explicit wrapper div for ResponsiveContainer to prevent width(-1) errors */}
          <div style={{ width: '100%', height: 250, minHeight: 250, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as TriggerDataPoint;
                      return (
                        <div className="bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-xl border border-border">
                          <p className="font-bold mb-1">{d.name}</p>
                          <p>Count: <span className="font-bold" style={{ color: d.fill }}>{d.value}</span></p>
                          <p className="text-muted-foreground">{d.percentage}% of total</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Custom Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate text-muted-foreground flex-1">{item.name}</span>
              <span className="font-medium text-foreground">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}