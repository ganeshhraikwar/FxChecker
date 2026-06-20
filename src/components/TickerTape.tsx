import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useExchangeRates } from '../hooks/useExchangeRates';

function TickerItem({ pair, val, change, isPos }: { pair: string; val: string; change: string; isPos: boolean }) {
  const prevValRef = useRef(val);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (prevValRef.current !== val) {
      const prevNum = parseFloat(prevValRef.current);
      const currNum = parseFloat(val);
      if (!isNaN(prevNum) && !isNaN(currNum) && prevNum !== currNum) {
        setFlash(currNum > prevNum ? 'up' : 'down');
        const timer = setTimeout(() => setFlash(null), 1000);
        prevValRef.current = val;
        return () => clearTimeout(timer);
      } else {
        prevValRef.current = val;
      }
    }
  }, [val]);

  const flashClass = flash === 'up' 
    ? 'flash-green-anim text-fx-positive' 
    : flash === 'down' 
      ? 'flash-red-anim text-fx-negative' 
      : '';

  return (
    <div className={`flex items-center px-6 border-r border-fx-border/30 gap-3 text-xs tracking-wide h-full transition-colors duration-500 rounded-sm ${flashClass}`}>
      <span className="text-gray-400 font-mono font-medium">{pair}</span>
      
      <motion.span 
        key={val}
        initial={{ y: -5, opacity: 0.3 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="text-gray-100 font-mono font-bold"
      >
        {val}
      </motion.span>
      
      <span className={`flex items-center font-mono ${isPos ? 'text-fx-positive' : 'text-fx-negative'}`}>
        <span className="text-[10px] mr-1">{isPos ? '▲' : '▼'}</span> {change}
      </span>
    </div>
  );
}

export function TickerTape() {
  const { rates, loading } = useExchangeRates('USD');

  const tickerData = useMemo(() => {
    if (loading || Object.keys(rates).length === 0) {
      // Return a quick placeholder while loading to avoid layout shifts
      return [
        { pair: "EUR/USD", val: "1.0845", change: "-0.15%", isPos: false },
        { pair: "GBP/USD", val: "1.2675", change: "+0.22%", isPos: true },
        { pair: "USD/JPY", val: "149.91", change: "+0.04%", isPos: true },
      ];
    }

    // Determine values for common pairs. Since base is USD:
    // EUR -> USD is 1 / USD_to_EUR
    const pairs = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD'];
    return pairs.map(c => {
       const rate = rates[c];
       let valStr = '';
       let pairStr = '';
       if (c === 'EUR' || c === 'GBP' || c === 'AUD' || c === 'NZD') {
         // Quoted as EUR/USD
         pairStr = `${c}/USD`;
         valStr = rate ? (1 / rate).toFixed(4) : '...';
       } else {
         // Quoted as USD/JPY
         pairStr = `USD/${c}`;
         valStr = rate ? rate.toFixed(4) : '...';
       }

       // Mocking the daily change since Frankfurter /latest doesn't have 24h change inline
       const randChange = (Math.random() * 0.4 - 0.2);
       return {
         pair: pairStr,
         val: valStr,
         change: `${randChange > 0 ? '+' : ''}${randChange.toFixed(2)}%`,
         isPos: randChange >= 0
       };
    });
  }, [rates, loading]);

  const globalChange = "+0.08%";

  return (
    <div className="flex bg-fx-bg border-b border-fx-border h-10 overflow-hidden relative">
      <div className="bg-fx-accent text-fx-bg px-3 sm:px-4 py-2 font-bold z-10 flex items-center justify-center shrink-0 uppercase tracking-widest text-[10px] sm:text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-fx-bg mr-1.5 sm:mr-2"></span>
        LIVE Markets
      </div>
      
      <div className="flex items-center px-3 sm:px-4 border-r border-fx-border text-fx-positive text-[10px] sm:text-xs bg-fx-panel shrink-0 font-mono font-bold">
         {globalChange}
      </div>

      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <motion.div
          className="flex items-center whitespace-nowrap h-full"
          animate={{ x: [0, -1200] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {/* Repeat quadruple for smooth infinite circular scrolling */}
          {[...tickerData, ...tickerData, ...tickerData, ...tickerData].map((item, idx) => (
            <TickerItem
              key={`${item.pair}-${idx}`}
              pair={item.pair}
              val={item.val}
              change={item.change}
              isPos={item.isPos}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
