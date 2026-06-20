import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENCY_FLAGS, CURRENCY_NAMES } from '../utils/currencies';

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}

export function SearchableSelect({ value, onChange, options }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(c => 
    c.toLowerCase().includes(search.toLowerCase()) || 
    (CURRENCY_NAMES[c] || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-[220px]">
      <button 
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="w-full bg-[#242428] rounded-xl px-4 py-3 flex items-center justify-between border border-fx-border hover:border-fx-accent/50 transition-all duration-200 active-press cursor-pointer"
      >
        <motion.div 
          key={value}
          initial={{ opacity: 0, x: -10, filter: "blur(2px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="flex items-center gap-3"
        >
          <motion.span 
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="text-xl inline-block origin-center select-none"
          >
            {CURRENCY_FLAGS[value] || '🌍'}
          </motion.span>
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-base font-bold text-gray-200">{value}</span>
            <span className="text-[10px] text-fx-text-dim truncate max-w-[100px]">{CURRENCY_NAMES[value] || 'Currency'}</span>
          </div>
        </motion.div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1b1b1e] border border-fx-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-fx-border/50 sticky top-0 bg-[#1b1b1e]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#242428] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-fx-accent font-sans"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-2 no-scrollbar">
              {filtered.map((c, index) => (
                <motion.button
                  key={c}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.015, 0.15) }}
                  onClick={() => { onChange(c); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 border-l-2 border-transparent hover:border-fx-accent hover:pl-4 cursor-pointer ${
                    value === c ? 'bg-fx-accent/15 border-l-fx-accent text-fx-accent font-bold' : 'hover:bg-[#242428] text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[18px] transition-transform duration-200 hover:scale-125">{CURRENCY_FLAGS[c] || '🌍'}</span>
                    <div className="flex flex-col">
                       <span className="font-bold text-sm tracking-wide">{c}</span>
                       <span className="text-[10px] opacity-70">{CURRENCY_NAMES[c]}</span>
                    </div>
                  </div>
                  {value === c && <Check size={16} className="text-fx-accent" />}
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">No currencies found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
