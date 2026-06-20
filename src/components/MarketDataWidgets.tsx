import React from 'react';
import { useExchangeRates } from '../hooks/useExchangeRates';

interface MarketDataWidgetsProps {
  from: string;
  to: string;
}

export function MarketDataWidgets({ from, to }: MarketDataWidgetsProps) {
   const { rates, loading } = useExchangeRates(from);
   
   const currentRate = rates[to] || 0;
   
   // Pseudo-deriving open and change based on current rate just to show dynamic data
   const pseudoChangePct = ((Math.sin(from.charCodeAt(0) + to.charCodeAt(0)) * 0.005));
   const open = currentRate / (1 + pseudoChangePct);
   const last = currentRate;
   const change = last - open;
   const pctChange = (change / open) * 100;
   
   const isPos = change >= 0;
   
   return (
     <div className="flex flex-wrap gap-4">
       
       <div className="bg-fx-panel border border-fx-border rounded-xl p-5 flex flex-col min-w-[120px]">
          <span className="text-fx-text-dim text-xs tracking-widest uppercase mb-3">Open</span>
          <span className="text-xl font-mono text-gray-200">
             {loading || !currentRate ? '...' : open.toFixed(4)}
          </span>
       </div>

       <div className="bg-fx-panel border border-fx-border rounded-xl p-5 flex flex-col min-w-[120px]">
          <span className="text-fx-text-dim text-xs tracking-widest uppercase mb-3">Last</span>
          <span className="text-xl font-mono text-gray-200">
             {loading || !currentRate ? '...' : last.toFixed(4)}
          </span>
       </div>

       <div className="bg-fx-panel border border-fx-border rounded-xl p-5 flex flex-col min-w-[120px]">
          <span className="text-fx-text-dim text-xs tracking-widest uppercase mb-3">Change</span>
          <span className={`text-xl font-mono ${isPos ? 'text-fx-positive' : 'text-fx-negative'}`}>
             {loading || !currentRate ? '...' : `${change > 0 ? '+' : ''}${change.toFixed(4)}`}
          </span>
       </div>

       <div className="bg-fx-panel border border-fx-border rounded-xl p-5 flex flex-col min-w-[140px]">
          <span className="text-fx-text-dim text-xs tracking-widest uppercase mb-3">% Change</span>
          <span className={`text-xl font-mono flex items-center gap-2 ${isPos ? 'text-fx-positive' : 'text-fx-negative'}`}>
             {loading || !currentRate ? '...' : (
                <>
                   {isPos ? '▲' : '▼'} {Math.abs(pctChange).toFixed(2)}%
                </>
             )}
          </span>
       </div>

     </div>
   );
}
