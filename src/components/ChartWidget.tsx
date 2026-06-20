import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useHistoricalRates, Timeframe } from '../hooks/useHistoricalRates';

interface ChartWidgetProps {
  from: string;
  to: string;
  timeframe?: Timeframe;
}

export function ChartWidget({ from, to, timeframe = '1M' }: ChartWidgetProps) {
  const { data, loading, error } = useHistoricalRates(from, to, timeframe);

  const latestVal = data && data.length > 0 ? data[data.length - 1].value.toFixed(4) : '...';

  // Format X Axis locally
  const formattedData = useMemo(() => {
     if (!data) return [];
     return data.map(d => {
        // e.g. "2023-11-20" -> "Nov 20"
        const dateObj = new Date(d.date);
        const displayDate = isNaN(dateObj.getTime()) ? d.date : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
           time: displayDate,
           value: d.value,
           displayValue: d.value.toFixed(4)
        };
     });
  }, [data]);

  return (
    <div className="bg-fx-panel border border-fx-border rounded-3xl p-6 h-[400px] flex flex-col relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-100 font-sans tracking-widest text-sm uppercase">{from}/{to} - {timeframe}</h3>
        
        {/* Top Right Info */}
        <div className="flex items-center gap-4 text-xs font-mono text-fx-text-dim">
           <span className="text-gray-200">{latestVal}</span>
           <span>•</span>
           <span className="uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} EOD</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full relative">
        {loading && (
           <div className="absolute inset-0 flex items-center justify-center text-fx-text-dim z-20">
             Loading chart data...
           </div>
        )}
        {error && (
           <div className="absolute inset-0 flex items-center justify-center text-fx-negative z-20">
             {error}
           </div>
        )}
        
        {!loading && !error && formattedData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-fx-accent)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-fx-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis 
                domain={['auto', 'auto']} 
                hide 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1b1b1e', border: '1px solid var(--color-fx-border)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: 'var(--color-fx-accent)' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-fx-accent)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        
        {/* Fake Grid/Axis Labels (only show if have data to derive min max) */}
        {!loading && !error && formattedData.length > 0 && (
          <>
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-4 text-[10px] text-fx-text-dim font-mono z-0">
                <span>{(formattedData.reduce((max, p) => p.value > max ? p.value : max, formattedData[0].value) * 1.005).toFixed(4)}</span>
                <span>{(formattedData.reduce((min, p) => p.value < min ? p.value : min, formattedData[0].value) * 0.995).toFixed(4)}</span>
            </div>
            {/* simple X axis labels from current dataset limits */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-fx-text-dim px-8 font-mono pb-2 z-0">
                <span className="hidden sm:inline">{formattedData[0]?.time}</span>
                <span className="hidden sm:inline">{formattedData[Math.floor(formattedData.length * 0.25)]?.time}</span>
                <span>{formattedData[Math.floor(formattedData.length * 0.5)]?.time}</span>
                <span className="hidden sm:inline">{formattedData[Math.floor(formattedData.length * 0.75)]?.time}</span>
                <span>{formattedData[formattedData.length - 1]?.time}</span>
            </div>
          </>
        )}
      </div>
      
    </div>
  );
}

