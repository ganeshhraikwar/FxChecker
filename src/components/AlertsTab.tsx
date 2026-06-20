import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SearchableSelect } from './SearchableSelect';
import { useExchangeRates } from '../hooks/useExchangeRates';

interface RateAlert {
  id: string;
  from: string;
  to: string;
  targetRate: number;
  condition: 'ABOVE' | 'BELOW';
}

export function AlertsTab({ defaultFrom = 'USD' }: { defaultFrom?: string }) {
  const [alerts, setAlerts] = useLocalStorage<RateAlert[]>('fx-alerts', []);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState('EUR');
  const [targetRate, setTargetRate] = useState('');
  const [condition, setCondition] = useState<'ABOVE'|'BELOW'>('ABOVE');
  
  const { rates } = useExchangeRates(from);
  const currencies = Object.keys(rates).length > 0 ? Object.keys(rates) : ['USD', 'EUR', 'GBP'];
  const currentRate = rates[to] || 0;

  const handleAdd = () => {
    const rateVal = parseFloat(targetRate);
    if (!rateVal || isNaN(rateVal)) return;
    setAlerts(prev => [...prev, { id: Math.random().toString(), from, to, targetRate: rateVal, condition }]);
    setTargetRate('');
  };

  const handleRemove = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-fx-panel border border-fx-border rounded-2xl p-6">
      <h3 className="text-gray-300 tracking-widest text-xs uppercase mb-6">Rate Alerts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 bg-[#1b1b1e] p-4 rounded-xl border border-fx-border/50 items-end">
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim">From</label>
            <SearchableSelect value={from} onChange={setFrom} options={currencies} />
         </div>
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim">To</label>
            <SearchableSelect value={to} onChange={setTo} options={currencies} />
         </div>
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim">Condition</label>
            <select 
               value={condition} 
               onChange={e => setCondition(e.target.value as any)}
               className="bg-[#242428] rounded-lg px-4 py-[13px] text-sm text-gray-200 focus:outline-none border border-fx-border"
            >
               <option value="ABOVE">Goes Above</option>
               <option value="BELOW">Goes Below</option>
            </select>
         </div>
         <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim">Target Rate</label>
            <input 
              type="number" 
              value={targetRate} 
              onChange={e => setTargetRate(e.target.value)}
              placeholder={`Current: ${currentRate ? currentRate.toFixed(4) : '...'}`}
              step="any"
              className="bg-[#242428] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none border border-fx-border"
            />
         </div>
         <button onClick={handleAdd} className="bg-fx-accent text-fx-bg font-bold px-6 py-[13px] rounded-lg text-sm uppercase tracking-wider hover:bg-fx-accent/90 transition-colors h-full">
            Set
         </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center text-fx-text-dim py-10 font-mono text-sm">No active alerts.</div>
      ) : (
        <div className="space-y-3">
          {alerts.map(a => (
             <div key={a.id} className="flex justify-between items-center py-4 border-b border-fx-border/50 group">
                <div className="flex flex-col">
                  <span className="text-base text-gray-200 font-bold">{a.from} / {a.to}</span>
                  <span className="text-fx-text-dim text-xs mt-1">Alert when rate is {a.condition.toLowerCase()} {a.targetRate}</span>
                </div>
                <button onClick={() => handleRemove(a.id)} className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 text-3xl leading-none">
                  ×
                </button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
