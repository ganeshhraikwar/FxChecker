import React, { useState } from 'react';
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
  onConvert: (item: ConversionHistoryItem) => void;
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
  const [activeTab, setActiveTab] = useState('HISTORY');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const tabs = [
    { id: 'HISTORY', label: 'HISTORY' },
    { id: 'COMPARE', label: 'COMPARE' },
    { id: 'ALERTS', label: 'ALERTS' },
    { id: 'PORTFOLIO', label: 'PORTFOLIO' },
    { id: 'FAVORITES', label: 'FAVORITES', count: favorites.length },
    { id: 'LOG', label: 'LOG', count: history.length },
    { id: 'SETTINGS', label: 'SETTINGS' }
  ];

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = "ID,From,To,Amount,Result,Rate,Date\n";
    const csv = history.map(item => 
      `${item.id},${item.from},${item.to},${item.amount},${item.result},${item.rate},${new Date(item.timestamp).toISOString()}`
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
      <header className="flex items-center justify-between px-6 py-4 border-b border-fx-border bg-fx-panel">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-fx-accent rounded-sm flex items-center justify-center transform -skew-x-12">
            <span className="text-fx-bg font-bold text-xs">/</span>
          </div>
          <span className="font-bold text-base tracking-widest text-gray-200 uppercase">FX_CHECKER</span>
        </div>
        <div className="text-fx-text-dim text-xs tracking-widest uppercase">
          55 CURRENCIES • EOD • ECB DATA
        </div>
      </header>

      {/* Ticker Tape */}
      <TickerTape />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        
        {/* Converter Section */}
        <section>
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
        </section>

        {/* Tabs */}
        <MarketTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Content Area based on Tabs */}
        {activeTab === 'HISTORY' && (
           <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <MarketDataWidgets from={activeFrom} to={activeTo} />
                 
                 <div className="flex items-center gap-2 bg-fx-panel border border-fx-border rounded-xl p-1.5 text-xs font-mono shadow-sm">
                   {timeframes.map((t) => (
                      <button 
                         key={t} 
                         onClick={() => setTimeframe(t)}
                         className={`px-4 py-2 flex items-center justify-center rounded-lg transition-colors ${
                            timeframe === t ? 'bg-[#26262a] text-gray-200' : 'text-fx-text-dim hover:text-gray-300'
                         }`}
                      >
                        {t}
                      </button>
                   ))}
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
               <div className="text-fx-text-dim py-10">No favorites saved.</div>
             ) : (
               <ul className="space-y-2">
                 {favorites.map(f => (
                   <li key={f.id} className="cursor-pointer hover:text-fx-accent flex items-center justify-between border-b border-fx-border/50 py-3" onClick={() => onSelectFavorite(f)}>
                      <span className="text-base">{f.from} / {f.to}</span>
                      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(f); }} className="text-fx-accent hover:text-red-400 p-2">★</button>
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
                  <button onClick={handleExportCSV} className="text-xs text-fx-accent hover:text-fx-accent/80 border border-fx-accent px-3 py-1 rounded">Export CSV</button>
                  <button onClick={onClearHistory} className="text-xs text-fx-negative hover:text-red-400 border border-fx-negative px-3 py-1 rounded">Clear All</button>
                </div>
             </div>

             {history.length === 0 ? (
               <div className="text-fx-text-dim py-10">No history logged.</div>
             ) : (
               <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                <ul className="space-y-2">
                  {history.map(item => (
                    <li key={item.id} className="flex justify-between items-center border-b border-fx-border/50 py-3 group">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                           <span className="text-base text-gray-200">{item.amount} {item.from} <span className="text-fx-text-dim text-xs">→</span> {item.result.toFixed(2)} {item.to}</span>
                           <span className="text-fx-text-dim text-[11px] mt-0.5">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <button 
                           onClick={() => onDeleteHistoryItem(item.id)}
                           className="text-fx-text-dim hover:text-fx-negative opacity-0 group-hover:opacity-100 transition-opacity p-2"
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

      </main>
    </div>
  );
}
