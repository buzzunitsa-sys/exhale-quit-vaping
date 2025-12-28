import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { ChartDataPoint } from '@/lib/stats-utils';
interface StatsChartProps {
  data: ChartDataPoint[];
}
export function StatsChart({ data }: StatsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-white/50 bg-white/5 rounded-xl backdrop-blur-sm">
        No data available yet
      </div>
    );
  }
  return (
    <div className="w-full h-[300px] relative min-w-0">
      {/* Year Label */}
      <div className="absolute top-0 left-4 bg-slate-800/50 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm z-10">
        {new Date().getFullYear()}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 40, right: 20, bottom: 20, left: -20 }}
        >
          <CartesianGrid
            strokeDasharray="5 5"
            vertical={true}
            horizontal={true}
            stroke="rgba(255,255,255,0.2)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            domain={[0, 'auto']}
            tickCount={5}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload as ChartDataPoint;
                return (
                  <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700">
                    <p className="font-bold mb-2 text-sm">{d.fullDate}</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white"/>
                        <span>Puffs: <span className="font-bold">{d.puffs}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"/>
                        <span>Avg: <span className="font-bold">{d.average}</span></span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ stroke: 'rgba(255,255,255,0.5)', strokeWidth: 1 }}
          />
          {/* Average Line */}
          <Line
            type="monotone"
            dataKey="average"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 0 }}
            activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
          />
          {/* Puffs Line */}
          <Line
            type="monotone"
            dataKey="puffs"
            stroke="#ffffff"
            strokeWidth={3}
            dot={{ r: 4, fill: '#ffffff', strokeWidth: 0 }}
            activeDot={{ r: 8, fill: '#ffffff', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {/* Custom Legend */}
      <div className="flex justify-center items-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white"></div>
          <span className="text-white/90 text-sm font-medium">Puffs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-white/90 text-sm font-medium">Average</span>
        </div>
      </div>
    </div>
  );
}