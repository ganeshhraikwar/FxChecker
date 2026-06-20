import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useExchangeRates } from '../hooks/useExchangeRates';

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
      <div className="bg-fx-accent text-fx-bg px-4 py-2 font-bold z-10 flex items-center justify-center shrink-0 uppercase tracking-widest text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-fx-bg mr-2"></span>
        Live Markets
      </div>
      
      <div className="flex items-center px-4 border-r border-fx-border text-fx-positive text-xs bg-fx-panel shrink-0 font-medium">
         {globalChange}
      </div>

      <div className="flex-1 overflow-hidden relative flex items-center">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
        >
          {/* Repeat triple for smooth infinite effect */}
          {[...tickerData, ...tickerData, ...tickerData, ...tickerData].map((item, idx) => (
            <div key={idx} className="flex items-center px-6 border-r border-fx-border/30 gap-3 text-xs tracking-wide">
              <span className="text-gray-400">{item.pair}</span>
              <span className="text-gray-100">{item.val}</span>
              <span className={`flex items-center ${item.isPos ? 'text-fx-positive' : 'text-fx-negative'}`}>
                {item.isPos ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
