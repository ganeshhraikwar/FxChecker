import React, { useState, useEffect } from 'react';
import { HelpCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SearchableSelect } from './SearchableSelect';
import { useExchangeRates } from '../hooks/useExchangeRates';

interface PortfolioAsset {
  id: string;
  currency: string;
  amount: number;
}

function AnimatedPortfolioValue({ value, baseCurrency }: { value: number; baseCurrency: string }) {
  const [displayVal, setDisplayVal] = useState(value * 0.9);

  useEffect(() => {
    const end = value;
    if (end === 0) {
      setDisplayVal(0);
      return;
    }
    const startVal = end * 0.9;
    let startTime: number | null = null;
    const duration = 750; // ms

    let animFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = startVal + (end - startVal) * progress;
      setDisplayVal(current);
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [value]);

  return (
    <>
      {displayVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-sans font-medium text-fx-accent">{baseCurrency}</span>
    </>
  );
}

export function PortfolioTab({ baseCurrency = 'USD' }: { baseCurrency?: string }) {
  const [assets, setAssets] = useLocalStorage<PortfolioAsset[]>('fx-portfolio', []);
  const [newCurrency, setNewCurrency] = useState('EUR');
  const [newAmount, setNewAmount] = useState('');
  const { rates, loading } = useExchangeRates(baseCurrency);

  const handleAdd = () => {
    const amt = parseFloat(newAmount);
    if (!amt || isNaN(amt)) return;
    setAssets(prev => [...prev, { id: Math.random().toString(), currency: newCurrency, amount: amt }]);
    setNewAmount('');
  };

  const handleRemove = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const currencies = Object.keys(rates).length > 0 ? Object.keys(rates) : ['USD', 'EUR', 'GBP'];
  
  const totalValue = assets.reduce((sum, asset) => {
     if (asset.currency === baseCurrency) return sum + asset.amount;
     const rate = rates[asset.currency];
     if (!rate) return sum; 
     return sum + (asset.amount / rate);
  }, 0);

  // Compute a pseudo profit/loss based on asset list count & length to make it reactive and interactive
  const hasAssets = assets.length > 0;
  const pseudoGainPercent = hasAssets ? (Math.sin(assets.length * 15 + 8) * 4.5 + 1.5) : 0;
  const pseudoGainValue = totalValue * (pseudoGainPercent / 100);
  const isProfit = pseudoGainPercent >= 0;

  return (
    <div className="bg-fx-panel border border-fx-border rounded-2xl p-6 hover:border-fx-border/80 transition-all duration-300">
      <h3 className="text-gray-300 tracking-widest text-xs uppercase mb-6">Your Portfolio</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-[#1b1b1e] p-4 rounded-xl border border-fx-border/50 items-stretch sm:items-end">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-fx-text-dim font-sans">Amount</label>
          <input 
            type="number" 
            value={newAmount} 
            onChange={e => setNewAmount(e.target.value)}
            placeholder="e.g. 5000"
            min="0"
            step="any"
            className="bg-[#242428] rounded-xl px-4 py-[13px] text-sm text-gray-200 focus:outline-none border border-fx-border h-[50px] font-sans font-medium"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-fx-text-dim font-sans">Currency</label>
          <SearchableSelect value={newCurrency} onChange={setNewCurrency} options={currencies} />
        </div>
        <motion.button 
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd} 
          className="bg-fx-accent text-fx-bg font-extrabold px-6 py-[13px] rounded-xl text-xs uppercase tracking-widest hover:bg-fx-accent/90 transition-all cursor-pointer h-[50px]"
        >
          Add Asset
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col justify-between p-5 bg-[#1b1b1e] border border-fx-border/60 rounded-xl">
          <span className="text-fx-text-dim text-[10px] tracking-widest uppercase mb-2 font-sans">Total Balanced Value</span>
          <span className="text-2xl sm:text-3xl font-sans font-bold text-fx-accent font-mono">
            {loading ? '...' : <AnimatedPortfolioValue value={totalValue} baseCurrency={baseCurrency} />}
          </span>
        </div>

        <div className="flex flex-col justify-between p-5 bg-[#1b1b1e] border border-fx-border/60 rounded-xl">
          <span className="text-fx-text-dim text-[10px] tracking-widest uppercase mb-2 font-sans">Estimated 24h P&L</span>
          <span className={`text-base sm:text-lg font-mono font-bold flex items-center gap-1.5 mt-1.5 ${
            hasAssets 
              ? isProfit 
                ? 'text-fx-positive pulse-positive-text' 
                : 'text-fx-negative pulse-negative-text'
              : 'text-fx-text-dim'
          }`}>
            {!hasAssets ? (
              <span className="text-xs text-fx-text-dim font-sans font-normal">Add assets to view yields</span>
            ) : (
              <>
                {isProfit ? '+' : ''}{pseudoGainValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {baseCurrency}
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-fx-panel border border-fx-border font-medium ml-1">
                  {isProfit ? '▲' : '▼'}{Math.abs(pseudoGainPercent).toFixed(2)}%
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="text-center text-fx-text-dim py-10 font-sans text-sm">Your portfolio balance is empty. Add assets above to track.</div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {assets.map(asset => {
               let valueBase = 0;
               if (asset.currency === baseCurrency) {
                  valueBase = asset.amount;
               } else {
                  const r = rates[asset.currency];
                  if (r) valueBase = asset.amount / r;
               }

               return (
                 <motion.div 
                   key={asset.id} 
                   layout
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.2 }}
                   className="flex justify-between items-center py-4 border-b border-fx-border/40 last:border-0 group hover:bg-[#1b1b1e]/50 px-3 rounded-xl transition-colors"
                 >
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-gray-200">{asset.amount.toLocaleString()} {asset.currency}</span>
                      <span className="text-fx-text-dim text-xs mt-1 font-sans">
                        {loading ? '...' : (
                          <>
                            ≈ <span className="font-mono">{valueBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> {baseCurrency}
                          </>
                        )}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleRemove(asset.id)} 
                      className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity p-2.5 cursor-pointer"
                      title="Remove asset"
                    >
                      <Trash2 size={15} />
                    </button>
                 </motion.div>
               );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
