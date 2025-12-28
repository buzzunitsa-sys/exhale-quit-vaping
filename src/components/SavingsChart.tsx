import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { addDays, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
interface SavingsChartProps {
  currentSavings: number;
  dailySavings: number;
  currency: string;
}
export function SavingsChart({ currentSavings, dailySavings, currency }: SavingsChartProps) {
  const data = useMemo(() => {
    const points = [];
    const today = new Date();
    for (let i = 0; i <= 30; i++) {
      const date = addDays(today, i);
      points.push({
        date: format(date, 'MMM d'),
        savings: currentSavings + (dailySavings * i),
        fullDate: format(date, 'PP')
      });
    }
    return points;
  }, [currentSavings, dailySavings]);
  const projectedTotal = data[data.length - 1].savings;
  return (
    <Card className="bg-card border border-border/50 shadow-sm transition-colors duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Savings Projection
          </CardTitle>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+30 Days</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Projected Total</p>
          <p className="text-2xl font-bold text-foreground">
            {currency === 'USD' ? '$' : currency + ' '}{projectedTotal.toFixed(2)}
          </p>
        </div>
        <div className="h-[200px] w-full min-w-0 overflow-hidden">
          <div style={{ width: '100%', height: 200, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={6} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-xl border border-border">
                          <p className="font-bold mb-1">{d.fullDate}</p>
                          <p>Savings: <span className="font-bold text-emerald-400">{currency === 'USD' ? '$' : currency + ' '}{d.savings.toFixed(2)}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}