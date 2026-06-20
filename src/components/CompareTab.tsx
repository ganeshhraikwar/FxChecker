import React, { useState } from 'react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { SearchableSelect } from './SearchableSelect';
import { CURRENCY_FLAGS } from '../utils/currencies';

interface CompareTabProps {
  base: string;
  amount: number;
}

export function CompareTab({ base, amount: initialAmount }: CompareTabProps) {
  const { rates, loading, error } = useExchangeRates(base);
  const [compareList, setCompareList] = useState<string[]>(['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'].filter(c => c !== base));
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | 'NONE'>('NONE');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [amount, setAmount] = useState<string>(initialAmount.toString());

  const availableCurrencies = Object.keys(rates).filter(c => c !== base && !compareList.includes(c));

  const handleAdd = () => {
    if (newCurrency && !compareList.includes(newCurrency) && newCurrency !== base) {
      setCompareList([...compareList, newCurrency]);
    }
  };

  const handleRemove = (c: string) => {
    setCompareList(compareList.filter(item => item !== c));
  };

  let sortedList = [...compareList];
  if (sortOrder === 'ASC') {
    sortedList.sort((a, b) => (rates[a] || 0) - (rates[b] || 0));
  } else if (sortOrder === 'DESC') {
    sortedList.sort((a, b) => (rates[b] || 0) - (rates[a] || 0));
  }

  const numAmount = parseFloat(amount) || 0;

  return (
    <div className="bg-fx-panel border border-fx-border rounded-2xl p-6 min-h-[300px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 bg-[#1b1b1e] border border-fx-border/50 p-2 rounded-lg">
           <input 
             type="number"
             value={amount}
             onChange={e => setAmount(e.target.value)}
             className="bg-transparent w-24 px-2 py-1 focus:outline-none text-xl font-mono text-white"
             step="any"
           />
           <span className="text-fx-text-dim text-sm tracking-widest uppercase mr-2">{base}</span>
        </div>
        <div className="flex items-center gap-4">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-[#242428] rounded-lg px-3 py-2 text-xs border border-fx-border text-gray-200 focus:outline-none"
            >
               <option value="NONE">Default Sort</option>
               <option value="DESC">Rate: High to Low</option>
               <option value="ASC">Rate: Low to High</option>
            </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-[#1b1b1e] p-4 rounded-xl border border-fx-border/50">
        <div className="w-full sm:w-auto flex-1">
          <SearchableSelect value={newCurrency} onChange={setNewCurrency} options={availableCurrencies.length ? availableCurrencies : ['USD', 'EUR']} />
        </div>
        <button onClick={handleAdd} className="bg-fx-accent text-fx-bg font-bold px-6 py-2 rounded-lg text-sm uppercase tracking-wider hover:bg-fx-accent/90 transition-colors">
          Add
        </button>
      </div>
      
      {loading && <div className="text-fx-text-dim">Loading rates...</div>}
      
      {error && <div className="text-fx-negative">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {sortedList.map(c => {
             const rate = rates[c] || 0;
             const converted = numAmount * rate;
             return (
               <div key={c} className="bg-[#1b1b1e] border border-fx-border/50 rounded-xl p-6 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-16 bg-fx-accent/5 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none transition-all group-hover:bg-fx-accent/10" />
                  
                  <div className="flex justify-between items-start mb-4">
                     <span className="text-2xl">{CURRENCY_FLAGS[c] || '🌍'}</span>
                     <button onClick={() => handleRemove(c)} className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                  
                  <span className="text-fx-text-dim text-xs tracking-widest mb-1 font-sans font-medium uppercase">{c}</span>
                  <span className="text-2xl font-mono text-gray-200 mb-4">
                    {converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-fx-text-dim text-[10px] tracking-wide mt-auto bg-[#242428] px-2 py-1 rounded inline-block w-max">
                    1 {base} = {rate.toFixed(4)} {c}
                  </span>
               </div>
             )
           })}
        </div>
      )}
    </div>
  );
}
