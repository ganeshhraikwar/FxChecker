import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Star } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { FavoritePair, ConversionHistoryItem } from '../types';
import { SearchableSelect } from './SearchableSelect';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface CurrencyConverterProps {
  favorites: FavoritePair[];
  onToggleFavorite: (pair: FavoritePair) => void;
  onConvert: (historyItem: ConversionHistoryItem) => void;
  defaultFrom?: string;
  defaultTo?: string;
  onFromChange?: (from: string) => void;
  onToChange?: (to: string) => void;
}

export function CurrencyConverter({ 
  favorites, 
  onToggleFavorite, 
  onConvert,
  defaultFrom = 'USD',
  defaultTo = 'EUR',
  onFromChange,
  onToChange
}: CurrencyConverterProps) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [amount, setAmount] = useState<string>('1000'); // Default to 1000 like mock
  
  const { rates, loading, error } = useExchangeRates(from);
  const isFavorite = favorites.some(f => f.from === from && f.to === to);
  
  const rate = rates[to] || 0;
  const result = (parseFloat(amount) || 0) * rate;

  useEffect(() => {
    if (defaultFrom && defaultFrom !== from) setFrom(defaultFrom);
    if (defaultTo && defaultTo !== to) setTo(defaultTo);
  }, [defaultFrom, defaultTo]);

  const handleFromChange = (newFrom: string) => {
     setFrom(newFrom);
     if (onFromChange) onFromChange(newFrom);
  };
  
  const handleToChange = (newTo: string) => {
     setTo(newTo);
     if (onToChange) onToChange(newTo);
  };

  const handleSwap = () => {
    handleFromChange(to);
    handleToChange(from);
  };

  const handleToggleFav = () => {
    onToggleFavorite({ id: `${from}-${to}`, from, to });
  };

  const handleLogConversion = () => {
     const numAmt = parseFloat(amount);
     if (numAmt > 0 && rate > 0 && !loading) {
       onConvert({
          id: Math.random().toString(36).substring(7),
          from,
          to,
          amount: numAmt,
          result,
          rate,
          timestamp: Date.now()
       });
     }
  };

  useKeyboardShortcuts({
    's': () => document.getElementById('send-amount-input')?.focus(),
    'f': handleToggleFav,
    'l': handleLogConversion,
  });

  const currencies = Object.keys(rates).length > 0 
    ? Object.keys(rates) 
    : ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'INR', 'CNY'];

  return (
    <div className="bg-fx-panel border border-fx-border rounded-3xl p-8 relative">
      <div className="flex flex-col md:flex-row items-center gap-4 relative">
        
        {/* From Block */}
        <div className="flex-1 w-full bg-[#1b1b1e] border border-fx-border/50 rounded-2xl p-6 relative">
          <label className="block text-xs text-fx-text-dim mb-4 tracking-widest uppercase">Send</label>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <input 
              id="send-amount-input"
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
              className="bg-transparent text-4xl font-sans font-medium text-white focus:outline-none w-full sm:w-1/2"
              placeholder="0"
            />
            <SearchableSelect value={from} onChange={handleFromChange} options={currencies} />
          </div>
        </div>

        {/* Swap Button container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-12 w-12 bg-fx-panel border-4 border-fx-panel rounded-xl items-center justify-center">
            <button 
              onClick={handleSwap}
              className="w-full h-full bg-[#1b1b1e] hover:bg-fx-border border border-fx-border/80 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white"
            >
              <ArrowDownUp size={16} />
            </button>
        </div>

        {/* To Block */}
        <div className="flex-1 w-full bg-[#1b1b1e] border border-fx-border/50 rounded-2xl p-6 relative">
          <label className="block text-xs text-fx-text-dim mb-4 tracking-widest uppercase">Receive</label>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-4xl font-sans font-medium text-fx-accent truncate w-full sm:w-1/2">
                {loading && !rate ? '...' : result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <SearchableSelect value={to} onChange={handleToChange} options={currencies} />
          </div>
        </div>

      </div>
      
      {error && (
        <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400/80 rounded-lg text-xs font-mono tracking-wide text-center">
          {error}
        </div>
      )}

      {/* Footer Area */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm font-mono text-gray-300">
           1 {from} = {rate.toFixed(4)} {to}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggleFav}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md border flex items-center gap-2 transition-all ${
              isFavorite 
                ? 'bg-fx-accent text-fx-bg border-fx-accent' 
                : 'bg-transparent text-fx-accent border-fx-accent hover:bg-fx-accent/10'
            }`}
          >
            <Star size={14} className={isFavorite ? 'fill-current' : ''} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
          
          <button 
            onClick={handleLogConversion}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md border border-fx-border text-gray-300 hover:text-white hover:border-gray-500 transition-all bg-transparent"
          >
            Log Conversion
          </button>
        </div>
      </div>
    </div>
  );
}
