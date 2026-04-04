'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';


import { AnalysisChartsProps } from '@/types/components';

export function AnalysisCharts({ videos }: AnalysisChartsProps) {
  // Prepare data: Views over time
  const data = [...videos]
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .map(v => ({
      date: new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: parseInt(v.statistics.viewCount),
      score: v.crushingScore
    }));

  return (
    <div className="grid grid-cols-1 gap-12 pt-12">
      {/* Views Trend */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">6-Month Performance Velocity</h4>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="text-[9px] text-neutral-400 font-bold uppercase">Views</span>
             </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full bg-white p-6 shadow-sm border border-neutral-200 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#082f49" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#082f49" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#a3a3a3" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#a3a3a3" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  fontSize: '10px'
                }}
                itemStyle={{ color: '#171717', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#082f49" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crushing Score Distribution */}
      <div className="space-y-6">
        <h4 className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em]">Algorithmic Consistency (Crushing Score)</h4>
        <div className="h-[200px] w-full bg-white p-6 shadow-sm border border-neutral-200 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#a3a3a3" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#a3a3a3" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  fontSize: '10px'
                }}
              />
              <Line 
                type="stepAfter" 
                dataKey="score" 
                stroke="#f97316" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
