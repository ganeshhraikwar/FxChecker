import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SearchableSelect } from './SearchableSelect';
import { useExchangeRates } from '../hooks/useExchangeRates';

interface PortfolioAsset {
  id: string;
  currency: string;
  amount: number;
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
     // rates are given as 1 baseCurrency = X asset.currency.
     // So value in base = asset.amount / rate
     return sum + (asset.amount / rate);
  }, 0);

  return (
    <div className="bg-fx-panel border border-fx-border rounded-2xl p-6">
      <h3 className="text-gray-300 tracking-widest text-xs uppercase mb-6">Your Portfolio</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-[#1b1b1e] p-4 rounded-xl border border-fx-border/50">
        <input 
          type="number" 
          value={newAmount} 
          onChange={e => setNewAmount(e.target.value)}
          placeholder="Amount"
          min="0"
          className="bg-[#242428] rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-fx-accent flex-1"
        />
        <div className="w-full sm:w-auto">
          <SearchableSelect value={newCurrency} onChange={setNewCurrency} options={currencies} />
        </div>
        <button onClick={handleAdd} className="bg-fx-accent text-fx-bg font-bold px-6 py-2 rounded-lg text-sm uppercase tracking-wider hover:bg-fx-accent/90 transition-colors">
          Add
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#242428] border border-fx-border rounded-xl mb-6">
        <span className="text-fx-text-dim text-sm tracking-widest uppercase">Total Value ({baseCurrency})</span>
        <span className="text-3xl font-sans font-bold text-fx-accent">
          {loading ? '...' : totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {assets.length === 0 ? (
        <div className="text-center text-fx-text-dim py-10 font-mono text-sm">No assets in portfolio.</div>
      ) : (
        <div className="space-y-3">
          {assets.map(asset => {
             let valueBase = 0;
             if (asset.currency === baseCurrency) {
                valueBase = asset.amount;
             } else {
                const r = rates[asset.currency];
                if (r) valueBase = asset.amount / r;
             }

             return (
               <div key={asset.id} className="flex justify-between items-center py-4 border-b border-fx-border/50 group">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-200">{asset.amount.toLocaleString()} {asset.currency}</span>
                    <span className="text-fx-text-dim text-xs mt-1">
                      {loading ? '...' : `≈ ${valueBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${baseCurrency}`}
                    </span>
                  </div>
                  <button onClick={() => handleRemove(asset.id)} className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2">
                    Remove
                  </button>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
