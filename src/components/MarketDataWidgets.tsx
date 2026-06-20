import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useExchangeRates } from '../hooks/useExchangeRates';

interface MarketDataWidgetsProps {
  from: string;
  to: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayVal, setDisplayVal] = useState(value * 0.95);

  useEffect(() => {
    const end = value;
    if (end === 0) return;
    
    // Count up from 95% of target value for premium professional motion speeds
    const startVal = end * 0.95; 
    let startTime: number | null = null;
    const duration = 650; // ms

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

  return <>{displayVal.toFixed(4)}</>;
}

function AnimatedPercent({ value }: { value: number }) {
  const [displayVal, setDisplayVal] = useState(value * 0.5);

  useEffect(() => {
    const end = value;
    const startVal = end * 0.5; 
    let startTime: number | null = null;
    const duration = 650; // ms

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

  return <>{Math.abs(displayVal).toFixed(2)}%</>;
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

   const cardVar: any = {
     initial: { opacity: 0, y: 10 },
     animate: (i: number) => ({
       opacity: 1, 
       y: 0,
       transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" }
     })
   };

   return (
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
       
       <motion.div 
         custom={0}
         initial="initial"
         animate="animate"
         variants={cardVar}
         whileHover={{ scale: 1.03, borderColor: "rgba(210, 255, 40, 0.4)", boxShadow: "0 4px 20px -5px rgba(210, 255, 40, 0.1)" }}
         className="bg-fx-panel border border-fx-border rounded-xl p-4 sm:p-5 flex flex-col hover-lift"
       >
          <span className="text-fx-text-dim text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 font-sans">Open</span>
          <span className="text-lg sm:text-xl font-mono text-gray-200 font-bold">
             {loading || !currentRate ? '...' : <AnimatedNumber value={open} />}
          </span>
       </motion.div>

       <motion.div 
         custom={1}
         initial="initial"
         animate="animate"
         variants={cardVar}
         whileHover={{ scale: 1.03, borderColor: "rgba(210, 255, 40, 0.4)", boxShadow: "0 4px 20px -5px rgba(210, 255, 40, 0.1)" }}
         className="bg-fx-panel border border-fx-border rounded-xl p-4 sm:p-5 flex flex-col hover-lift"
       >
          <span className="text-fx-text-dim text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 font-sans">Last</span>
          <span className="text-lg sm:text-xl font-mono text-gray-200 font-bold">
             {loading || !currentRate ? '...' : <AnimatedNumber value={last} />}
          </span>
       </motion.div>

       <motion.div 
         custom={2}
         initial="initial"
         animate="animate"
         variants={cardVar}
         whileHover={{ scale: 1.03, borderColor: "rgba(210, 255, 40, 0.4)", boxShadow: "0 4px 20px -5px rgba(210, 255, 40, 0.1)" }}
         className="bg-fx-panel border border-fx-border rounded-xl p-4 sm:p-5 flex flex-col hover-lift"
       >
          <span className="text-fx-text-dim text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 font-sans">Change</span>
          <span className={`text-lg sm:text-xl font-mono font-bold ${isPos ? 'text-fx-positive' : 'text-fx-negative'}`}>
             {loading || !currentRate ? '...' : (
               <>
                 {change > 0 ? '+' : ''}
                 <AnimatedNumber value={change} />
               </>
             )}
          </span>
       </motion.div>

       <motion.div 
         custom={3}
         initial="initial"
         animate="animate"
         variants={cardVar}
         whileHover={{ scale: 1.03, borderColor: "rgba(210, 255, 40, 0.4)", boxShadow: "0 4px 20px -5px rgba(210, 255, 40, 0.1)" }}
         className="bg-fx-panel border border-fx-border rounded-xl p-4 sm:p-5 flex flex-col hover-lift"
       >
          <span className="text-fx-text-dim text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 font-sans">% Change</span>
          <span className={`text-lg sm:text-xl font-mono font-bold flex items-center gap-1 sm:gap-2 ${isPos ? 'text-fx-positive animate-pulse' : 'text-fx-negative animate-pulse'}`}>
             {loading || !currentRate ? '...' : (
                <>
                   <span className="text-[10px] sm:text-sm">{isPos ? '▲' : '▼'}</span> 
                   <AnimatedPercent value={pctChange} />
                </>
             )}
          </span>
       </motion.div>

     </div>
   );
}
