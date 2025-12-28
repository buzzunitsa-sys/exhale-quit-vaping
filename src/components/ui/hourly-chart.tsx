import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
// Mock data simulating hourly activity/cravings
const data = [
  { hour: '6', val: 0 }, { hour: '7', val: 0 }, { hour: '8', val: 1 },
  { hour: '9', val: 2 }, { hour: '10', val: 0 }, { hour: '11', val: 1 },
  { hour: '12', val: 3 }, { hour: '13', val: 1 }, { hour: '14', val: 0 },
  { hour: '15', val: 2 }, { hour: '16', val: 4 }, { hour: '17', val: 1 },
  { hour: '18', val: 0 }, { hour: '19', val: 2 }, { hour: '20', val: 0 },
];
export function HourlyChart() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-72">
      <h3 className="text-center font-semibold text-slate-800 mb-6 text-lg">Hourly overview</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                interval={2}
                dy={10}
            />
            <Bar dataKey="val" radius={[4, 4, 4, 4]} barSize={12}>
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
    </div>
  );
}