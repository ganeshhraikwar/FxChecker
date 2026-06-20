import React, { useState } from 'react';
import { Bell, BellRing, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  
  const [isBlown, setIsBlown] = useState(false);
  const { rates } = useExchangeRates(from);
  const currencies = Object.keys(rates).length > 0 ? Object.keys(rates) : ['USD', 'EUR', 'GBP'];
  const currentRate = rates[to] || 0;

  const handleAdd = () => {
    const rateVal = parseFloat(targetRate);
    if (!rateVal || isNaN(rateVal)) return;
    setAlerts(prev => [...prev, { id: Math.random().toString(), from, to, targetRate: rateVal, condition }]);
    setTargetRate('');
    
    // Trigger bell shake action
    setIsBlown(true);
    setTimeout(() => setIsBlown(false), 800);
  };

  const handleRemove = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-fx-panel border border-fx-border rounded-2xl p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-300 tracking-widest text-xs uppercase">Rate Alerts</h3>
        
        {/* Shaking Bell implementation */}
        <div className={`p-2 rounded-lg bg-fx-accent/10 border border-fx-accent/20 ${isBlown ? 'bell-shake-active text-fx-accent' : 'text-fx-text-dim'}`}>
          {isBlown ? <BellRing size={16} /> : <Bell size={16} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 bg-[#1b1b1e] p-4 rounded-xl border border-fx-border/50 items-end">
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim font-sans">From</label>
            <SearchableSelect value={from} onChange={setFrom} options={currencies} />
         </div>
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim font-sans">To</label>
            <SearchableSelect value={to} onChange={setTo} options={currencies} />
         </div>
         <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim font-sans">Condition</label>
            <select 
               value={condition} 
               onChange={e => setCondition(e.target.value as any)}
               className="bg-[#242428] rounded-lg px-4 py-[13px] text-sm text-gray-200 focus:outline-none border border-fx-border cursor-pointer h-[50px] font-sans"
            >
               <option value="ABOVE">Goes Above</option>
               <option value="BELOW">Goes Below</option>
            </select>
         </div>
         <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] uppercase tracking-widest text-fx-text-dim font-sans">Target Rate</label>
            <input 
              type="number" 
              value={targetRate} 
              onChange={e => setTargetRate(e.target.value)}
              placeholder={`Current: ${currentRate ? currentRate.toFixed(4) : '...'}`}
              step="any"
              className="bg-[#242428] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none border border-fx-border h-[50px] font-sans font-medium"
            />
         </div>
         <motion.button 
           whileHover={{ scale: 1.04 }}
           whileTap={{ scale: 0.96 }}
           onClick={handleAdd} 
           className="bg-fx-accent text-fx-bg font-extrabold px-6 py-[13px] rounded-lg text-xs uppercase tracking-widest hover:bg-fx-accent/90 transition-colors h-[50px] cursor-pointer"
         >
            Set Alert
         </motion.button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center text-fx-text-dim py-10 font-sans text-sm">No active alerts configured.</div>
      ) : (
        <div className="space-y-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {alerts.map(a => (
               <motion.div 
                 key={a.id} 
                 layout
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -50 }}
                 transition={{ type: "spring", stiffness: 450, damping: 28 }}
                 className="flex justify-between items-center py-4 border-b border-fx-border/40 last:border-0 group hover:bg-[#1b1b1e]/50 px-3 rounded-lg transition-colors"
               >
                  <div className="flex flex-col">
                    <span className="text-base text-gray-200 font-bold">{a.from} / {a.to}</span>
                    <span className="text-fx-text-dim text-xs mt-1 font-sans">Trigger when rate moves <span className="text-fx-accent font-bold">{a.condition.toLowerCase()}</span> {a.targetRate}</span>
                  </div>
                  <button 
                    onClick={() => handleRemove(a.id)} 
                    className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity p-2.5 cursor-pointer"
                    title="Remove Alert"
                  >
                    <Trash2 size={15} />
                  </button>
               </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
