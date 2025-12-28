import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
const data = [
  { name: 'W48', puffs: 45, average: 30 },
  { name: 'W49', puffs: 50, average: 32 },
  { name: 'W50', puffs: 40, average: 35 },
  { name: 'W51', puffs: 30, average: 28 },
  { name: 'W52', puffs: 26, average: 25 }, // The focused point in the design
  { name: 'W01', puffs: 20, average: 22 },
  { name: 'W02', puffs: 15, average: 18 },
];
export function StatsChart() {
  return (
    <div className="w-full h-[300px] relative">
      {/* Year Label */}
      <div className="absolute top-0 left-4 bg-slate-800/50 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm z-10">
        2025
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
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: 'none', 
              borderRadius: '8px', 
              color: '#fff' 
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: 'rgba(255,255,255,0.5)', strokeWidth: 1 }}
          />
          {/* 4-Week Average Line (Darker Blue/Purple in design) */}
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
          />
          {/* Weekly Puffs Line (White in design) */}
          <Line 
            type="monotone" 
            dataKey="puffs" 
            stroke="#ffffff" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#ffffff', strokeWidth: 0 }}
            activeDot={{ r: 8, fill: '#ffffff', strokeWidth: 0 }}
          />
          {/* Highlight specific line if needed, or rely on active state */}
          <ReferenceLine y={26} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
        </ComposedChart>
      </ResponsiveContainer>
      {/* Custom Legend */}
      <div className="flex justify-center items-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white"></div>
          <span className="text-white/90 text-sm font-medium">Weekly Puffs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-white/90 text-sm font-medium">4-Week Average</span>
        </div>
      </div>
    </div>
  );
}