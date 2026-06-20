import { useState, useEffect } from "react";
import { subDays, subWeeks, subMonths, subYears, format } from 'date-fns';

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export interface ChartDataPoint {
  date: string;
  value: number;
}

export function useHistoricalRates(from: string, to: string, timeframe: Timeframe) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    if (from === to) {
       setData(Array(10).fill(0).map((_, i) => ({ date: `Day ${i}`, value: 1 })));
       setLoading(false);
       return;
    }

    const now = new Date();
    let startDate = now;

    switch (timeframe) {
      case '1D': startDate = subDays(now, 2); break; // Frankfurter is daily, get last 2 days
      case '1W': startDate = subWeeks(now, 1); break;
      case '1M': startDate = subMonths(now, 1); break;
      case '3M': startDate = subMonths(now, 3); break;
      case '1Y': startDate = subYears(now, 1); break;
      case '5Y': startDate = subYears(now, 5); break;
    }

    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(now, 'yyyy-MM-dd');

    const fallbackToMockData = () => {
       const mockData = [];
       let current = 1.1; // arbitrary mock value
       let currentDate = startDate;
       while (currentDate <= now) {
         current += (Math.random() - 0.5) * 0.01;
         mockData.push({
           date: format(currentDate, 'yyyy-MM-dd'),
           value: current
         });
         currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
       }
       setData(mockData);
       setError('Using offline mock data due to API failure.');
       setLoading(false);
    };

    fetch(`https://api.frankfurter.dev/v1/${startStr}..${endStr}?base=${from}&symbols=${to}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch historical data');
        return res.json();
      })
      .then(json => {
        if (!active) return;
        if (!json.rates) throw new Error('No valid rate data');
        
        const chartData = Object.entries(json.rates).map(([date, ratesObj]: [string, any]) => ({
           date,
           value: ratesObj[to] as number
        }));

        setData(chartData);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        if (active) {
          console.error("Historical API error:", err);
          fallbackToMockData();
        }
      });

    return () => { active = false; };
  }, [from, to, timeframe]);

  return { data, loading, error };
}
