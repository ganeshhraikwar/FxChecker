import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
    <div className="bg-fx-panel border border-fx-border rounded-3xl p-6 md:p-8 relative hover:border-fx-border/80 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center relative">
        
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
              className="bg-transparent text-3xl sm:text-4xl font-sans font-medium text-white focus:outline-none w-full sm:w-1/2"
              placeholder="0"
            />
            <div className="w-full sm:w-auto">
              <SearchableSelect value={from} onChange={handleFromChange} options={currencies} />
            </div>
          </div>
        </div>

        {/* Swap Button container */}
        <div className="z-10 flex h-12 w-12 bg-fx-panel border-4 border-fx-panel rounded-xl items-center justify-center -my-3 md:my-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <motion.button 
              onClick={handleSwap}
              whileHover={{ rotate: 180, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className="w-full h-full bg-[#1b1b1e] hover:bg-fx-border border border-fx-border/80 rounded-lg flex items-center justify-center text-gray-400 hover:text-white cursor-pointer active-press"
              title="Swap Currencies"
            >
              <ArrowDownUp size={16} />
            </motion.button>
        </div>

        {/* To Block */}
        <div className="flex-1 w-full bg-[#1b1b1e] border border-fx-border/50 rounded-2xl p-6 relative">
          <label className="block text-xs text-fx-text-dim mb-4 tracking-widest uppercase">Receive</label>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-3xl sm:text-4xl font-sans font-medium text-fx-accent truncate w-full sm:w-1/2 font-mono overflow-hidden h-[40px] sm:h-[48px] flex items-center">
              <motion.div
                key={`${to}-${result}`}
                initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                {loading && !rate ? '...' : result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
            </div>
            <div className="w-full sm:w-auto">
              <SearchableSelect value={to} onChange={handleToChange} options={currencies} />
            </div>
          </div>
        </div>

      </div>
      
      {error && (
        <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400/80 rounded-lg text-xs font-mono tracking-wide text-center">
          {error}
        </div>
      )}

      {/* Footer Area */}
      <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
        <div className="text-sm font-mono text-gray-300 font-medium overflow-hidden h-[24px] flex items-center">
          <motion.div
            key={`${from}-${to}-${rate}`}
            initial={{ opacity: 0, y: 10, filter: "blur(1px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            1 {from} = <span className="text-fx-accent">{rate.toFixed(4)}</span> {to}
          </motion.div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <motion.button 
            onClick={handleToggleFav}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-3 sm:py-2 text-[11px] font-bold uppercase tracking-widest rounded-md border flex items-center justify-center sm:justify-start gap-2 cursor-pointer transition-colors duration-200 ${
              isFavorite 
                ? 'bg-fx-accent text-fx-bg border-fx-accent shadow-[0_0_12px_rgba(210,255,40,0.35)]' 
                : 'bg-transparent text-fx-accent border-fx-accent hover:bg-fx-accent/10'
            }`}
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Star size={13} className={isFavorite ? 'fill-current' : ''} />
            </motion.div>
            {isFavorite ? 'Favorited' : 'Favorite'}
          </motion.button>
          
          <motion.button 
            onClick={handleLogConversion}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 sm:py-2 text-[11px] font-bold uppercase tracking-widest rounded-md border border-fx-border text-gray-300 hover:text-white hover:border-gray-500 transition-all bg-transparent w-full sm:w-auto text-center cursor-pointer font-mono"
          >
            Log Conversion
          </motion.button>
        </div>
      </div>
    </div>
  );
}
