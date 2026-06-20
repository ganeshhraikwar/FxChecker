import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CurrencyConverter } from './CurrencyConverter';
import { FavoritePair, ConversionHistoryItem } from '../types';
import { TickerTape } from './TickerTape';
import { MarketDataWidgets } from './MarketDataWidgets';
import { ChartWidget } from './ChartWidget';
import { MarketTabs } from './MarketTabs';
import { Timeframe } from '../hooks/useHistoricalRates';
import { CompareTab } from './CompareTab';
import { PortfolioTab } from './PortfolioTab';
import { AlertsTab } from './AlertsTab';
import { SettingsTab } from './SettingsTab';

interface DashboardLayoutProps {
  favorites: FavoritePair[];
  history: ConversionHistoryItem[];
  activeFrom: string;
  activeTo: string;
  onToggleFavorite: (pair: FavoritePair) => void;
  onSelectFavorite: (pair: FavoritePair) => void;
  onConvert: (historyItem: ConversionHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  setActiveFrom: (c: string) => void;
  setActiveTo: (c: string) => void;
}

export function DashboardLayout({
  favorites,
  history,
  activeFrom,
  activeTo,
  onToggleFavorite,
  onSelectFavorite,
  onConvert,
  onClearHistory,
  onDeleteHistoryItem,
  setActiveFrom,
  setActiveTo
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<string>('HISTORY');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const tabs = [
    { id: 'HISTORY', label: 'History & Chart' },
    { id: 'COMPARE', label: 'Compare Currencies' },
    { id: 'ALERTS', label: 'Rate Alerts' },
    { id: 'PORTFOLIO', label: 'Portfolio Tracker' },
    { id: 'FAVORITES', label: 'Favorites', count: favorites.length },
    { id: 'LOG', label: 'Activity Log', count: history.length },
    { id: 'SETTINGS', label: 'Settings' }
  ];

  const handleExportCSV = () => {
    if (history.length === 0) return;
    
    const headers = "ID,From,To,Amount,Result,Rate,Timestamp\n";
    const csv = history.map(item => 
      `"${item.id}","${item.from}","${item.to}",${item.amount},${item.result},${item.rate},"${new Date(item.timestamp).toISOString()}"`
    ).join("\n");
    
    const blob = new Blob([headers + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "conversion_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timeframes: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  return (
    <div className="flex flex-col min-h-screen bg-fx-bg text-gray-100 font-mono text-sm tracking-wide">
      
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-fx-border bg-fx-panel">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-fx-accent rounded-sm flex items-center justify-center transform -skew-x-12 logo-pulse">
            <span className="text-fx-bg font-bold text-xs font-sans">/</span>
          </div>
          <span className="font-bold text-sm sm:text-base tracking-widest text-gray-200 uppercase">FX_CHECKER</span>
        </div>
        <div className="text-fx-text-dim text-[8px] xs:text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase text-right font-mono font-medium">
          55 CURRENCIES • EOD • ECB DATA
        </div>
      </header>

      {/* Ticker Tape */}
      <TickerTape />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        
        {/* Converter Section */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-gray-300 uppercase tracking-widest font-semibold mb-4 text-xs">Check the rate</h2>
          <CurrencyConverter 
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onConvert={onConvert}
            defaultFrom={activeFrom}
            defaultTo={activeTo}
            onFromChange={setActiveFrom}
            onToChange={setActiveTo}
          />
        </motion.section>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <MarketTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* Dynamic Content Area based on Tabs */}
        <div className="relative overflow-visible">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            {activeTab === 'HISTORY' && (
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full animate-fadeIn">
                     <div className="w-full md:w-auto">
                       <MarketDataWidgets from={activeFrom} to={activeTo} />
                     </div>
                     
                     <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-1 sm:gap-2 bg-fx-panel border border-fx-border rounded-xl p-1.5 text-[10px] sm:text-xs font-mono shadow-sm relative overflow-hidden">
                       {timeframes.map((t) => {
                          const isActive = timeframe === t;
                          return (
                            <button 
                               key={t} 
                               onClick={() => setTimeframe(t)}
                               className={`flex-1 md:flex-none px-2.5 sm:px-4 py-2 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer relative z-10 font-sans ${
                                  isActive ? 'text-fx-bg font-extrabold' : 'text-fx-text-dim hover:text-gray-200'
                               }`}
                            >
                              <span className="relative z-10">{t}</span>
                              {isActive && (
                                <motion.span 
                                  layoutId="activeTimeframeIndicator"
                                  className="absolute inset-0 bg-fx-accent rounded-lg"
                                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                  style={{ zIndex: 0 }}
                                />
                              )}
                            </button>
                          );
                       })}
                     </div>
                  </div>
                  <ChartWidget from={activeFrom} to={activeTo} timeframe={timeframe} />
               </div>
            )}

            {activeTab === 'COMPARE' && (
               <CompareTab base={activeFrom} amount={1000} />
            )}
            
            {activeTab === 'ALERTS' && (
               <AlertsTab defaultFrom={activeFrom} />
            )}

            {activeTab === 'PORTFOLIO' && (
               <PortfolioTab baseCurrency="USD" />
            )}

            {activeTab === 'SETTINGS' && (
               <SettingsTab />
            )}
            
            {activeTab === 'FAVORITES' && (
               <div className="bg-fx-panel border border-fx-border rounded-2xl p-6 min-h-[300px]">
                 {favorites.length === 0 ? (
                   <div className="text-fx-text-dim py-10 font-sans text-center">No favorites saved.</div>
                 ) : (
                   <ul className="space-y-2">
                     {favorites.map(f => (
                       <li key={f.id} className="cursor-pointer hover:bg-fx-border/30 rounded-xl px-4 py-3 flex items-center justify-between border-b border-fx-border/30 last:border-0 hover-lift active-press" onClick={() => onSelectFavorite(f)}>
                          <span className="text-base text-gray-200 font-bold">{f.from} / {f.to}</span>
                          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(f); }} className="text-fx-accent hover:scale-125 transition-transform p-2 text-lg">★</button>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
            )}

            {activeTab === 'LOG' && (
               <div className="bg-fx-panel border border-fx-border rounded-2xl p-6 min-h-[300px] flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-300 tracking-widest text-xs uppercase uppercase">Conversion Log</h3>
                    <div className="flex gap-4">
                      <button onClick={handleExportCSV} className="text-xs text-fx-accent hover:text-fx-accent/80 border border-fx-accent px-3 py-1 rounded cursor-pointer active-press">Export CSV</button>
                      <button onClick={onClearHistory} className="text-xs text-fx-negative hover:text-red-400 border border-fx-negative px-3 py-1 rounded cursor-pointer active-press">Clear All</button>
                    </div>
                 </div>

                 {history.length === 0 ? (
                   <div className="text-fx-text-dim py-10 font-sans text-center">No history logged.</div>
                 ) : (
                   <div className="max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    <ul className="space-y-2">
                      {history.map(item => (
                        <li key={item.id} className="flex justify-between items-center border-b border-fx-border/50 py-3 group hover:bg-fx-border/10 rounded-lg px-2 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                               <span className="text-base text-gray-200 font-medium">{item.amount} {item.from} <span className="text-fx-text-dim text-xs">→</span> {item.result.toFixed(2)} {item.to}</span>
                               <span className="text-fx-text-dim text-[11px] mt-0.5">{new Date(item.timestamp).toLocaleString()}</span>
                            </div>
                            <button 
                               onClick={() => onDeleteHistoryItem(item.id)}
                               className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-pointer"
                               title="Delete Entry"
                            >
                               ×
                            </button>
                        </li>
                      ))}
                    </ul>
                   </div>
                 )}
               </div>
            )}
          </motion.div>
        </div>

      </main>
    </div>
  );
}
