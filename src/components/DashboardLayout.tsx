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
import { GaneshBadge, PortfolioButton } from './GaneshBranding';

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
          className="flex flex-col gap-2"
        >
          <div className="mb-2">
            <h1 className="text-gray-100 text-lg sm:text-2xl font-bold font-sans tracking-tight">
              FX Checker — <span className="text-fx-accent font-extrabold">Live Currency Converter & AI Market Analytics</span>
            </h1>
            <p className="text-fx-text-dim text-xs sm:text-sm font-sans mt-1">
              Verify global interbank exchange rates instantly, trace historical market movements with high-precision charts, or consult our modern AI-powered expert module for immediate financial wisdom.
            </p>
          </div>
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

        {/* 🚀 Rich SEO Explanatory Content Section (H2, H3, lists for indexing) */}
        <hr className="border-t border-fx-border/50 my-4" />
        
        <section className="space-y-12 py-6 font-sans text-gray-300">
          
          {/* Section 1: Introduction & H2 */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-fx-accent rounded-sm inline-block"></span>
              Why Use FX Checker for Foreign Exchange & Rates?
            </h2>
            <p className="text-sm text-fx-text-dim leading-relaxed">
              Finding a fast, transparent, and completely automated currency converter shouldn't involve cluttered portals or high fees. <strong>FX Checker</strong> is an open-access, modern monetary calculator created specifically to satisfy both casual travelers and active FX portfolio trackers. By parsing authoritative reference exchange data from the European Central Bank (ECB) and secure interbank APIs, our system maps current market valuations down to sub-millisecond speeds.
            </p>
            <p className="text-sm text-fx-text-dim leading-relaxed text-balance">
              Unlike static conversion pages that reload on every input, our framework operates as a high-density Single Page Application (SPA) offering completely offline-friendly storage, live currency pair bookmarking, customizable alarms, and instant smart-searches.
            </p>
          </div>

          {/* Section 2: Core Perks & Grid with H3s */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-fx-accent rounded-sm inline-block"></span>
              Comprehensive Financial Market Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-fx-panel border border-fx-border/80 rounded-2xl p-6 hover:border-fx-accent/40 transition-colors duration-300">
                <h3 className="text-base font-bold text-fx-accent mb-3 uppercase tracking-wider">
                  1. Real-Time Conversion Engine
                </h3>
                <p className="text-xs text-fx-text-dim leading-relaxed">
                  Input any global amount to see instant calculations computed dynamically. The real-time cross-rates allow complex intermediate conversions within seconds, completely eliminating manual math errors.
                </p>
              </div>

              <div className="bg-fx-panel border border-fx-border/80 rounded-2xl p-6 hover:border-fx-accent/40 transition-colors duration-300">
                <h3 className="text-base font-bold text-fx-accent mb-3 uppercase tracking-wider">
                  2. Interactive Exchange Rate Charts
                </h3>
                <p className="text-xs text-fx-text-dim leading-relaxed">
                  Track historical rates across flexible epochs including 1 Day, 1 Week, 1 Month, 3 Months, 1 Year, or a full 5-year outlook. Spot underlying trend patterns and spot support/resistance channels quickly.
                </p>
              </div>

              <div className="bg-fx-panel border border-fx-border/80 rounded-2xl p-6 hover:border-fx-accent/40 transition-colors duration-300">
                <h3 className="text-base font-bold text-fx-accent mb-3 uppercase tracking-wider">
                  3. Gemini 3.5 AI Financial Expert
                </h3>
                <p className="text-xs text-fx-text-dim leading-relaxed">
                  Ask our integrated intelligence about current macroeconomic shifts, inflation thresholds, currency hedging plans, or specific historical FX ranges. It acts as your personal financial advisor 24/7.
                </p>
              </div>

              <div className="bg-fx-panel border border-fx-border/80 rounded-2xl p-6 hover:border-fx-accent/40 transition-colors duration-300">
                <h3 className="text-base font-bold text-fx-accent mb-3 uppercase tracking-wider">
                  4. Multi-Currency Portfolio Tracker
                </h3>
                <p className="text-xs text-fx-text-dim leading-relaxed">
                  Maintain a visual mock ledger of multiple overseas holdings. View current valuations, net gains or losses, and check how fluctuations impact your aggregate international assets.
                </p>
              </div>

              <div className="bg-fx-panel border border-fx-border/80 rounded-2xl p-6 hover:border-fx-accent/40 transition-colors duration-300">
                <h3 className="text-base font-bold text-fx-accent mb-3 uppercase tracking-wider">
                  5. Smart Rate Alerts & Thresholds
                </h3>
                <p className="text-xs text-fx-text-dim leading-relaxed">
                  Establish targeted rate thresholds for your preferred trade pairs. Get immediate visual notifications and cues once the market triggers cross above or slip below your configured points.
                </p>
              </div>

              <div className="bg-fx-panel border border-fx-border/80 rounded-2xl p-6 hover:border-fx-accent/40 transition-colors duration-300">
                <h3 className="text-base font-bold text-fx-accent mb-3 uppercase tracking-wider">
                  6. Strict Data Privacy & Off-Grid Cache
                </h3>
                <p className="text-xs text-fx-text-dim leading-relaxed">
                  Your bookmarked favorites, configuration properties, and search histories remain locked exclusively in your local device storage. We never collect or harvest private transactional parameters.
                </p>
              </div>

            </div>
          </div>

          {/* Section 3: Supported Globals & Pairs */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-fx-accent rounded-sm inline-block"></span>
              Supported Global Currencies & Major Pairs
            </h2>
            <p className="text-sm text-fx-text-dim leading-relaxed">
              We provide full mathematical lookup models and historical graphs for a robust collection of global fiat assets, including major global reserve systems:
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">USD / EUR</span>
                <span className="text-[10px] text-fx-text-dim font-mono">United States Dollar / Euro</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">GBP / USD</span>
                <span className="text-[10px] text-fx-text-dim font-mono">British Pound Sterling / USD</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">USD / INR</span>
                <span className="text-[10px] text-fx-text-dim font-mono">US Dollar / Indian Rupee</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">EUR / JPY</span>
                <span className="text-[10px] text-fx-text-dim font-mono">Euro / Japanese Yen</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">USD / CAD</span>
                <span className="text-[10px] text-fx-text-dim font-mono">US Dollar / Canadian Dollar</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">AUD / USD</span>
                <span className="text-[10px] text-fx-text-dim font-mono">Australian Dollar / USD</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">USD / CHF</span>
                <span className="text-[10px] text-fx-text-dim font-mono">US Dollar / Swiss Franc</span>
              </div>
              <div className="bg-fx-panel/40 border border-fx-border/60 rounded-xl p-3 text-center">
                <span className="text-xs text-fx-accent font-bold block">GBP / EUR</span>
                <span className="text-[10px] text-fx-text-dim font-mono">Pound Sterling / Euro</span>
              </div>
            </div>

            <p className="text-xs text-fx-text-dim mt-4 leading-relaxed font-sans italic">
              * Note: All quotes retrieved through our endpoints are indicative rates suited for tracking, educational analysis, and personal verification. For high-stakes institutional wire settlements, please examine certified banking liquid assets.
            </p>
          </div>

          {/* Section 4: Offline calculation benefits */}
          <div className="bg-fx-panel border border-fx-border/60 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              ⚡ How Offline Conversion & Routing works on FX Checker
            </h3>
            <p className="text-xs sm:text-sm text-fx-text-dim leading-relaxed">
              When you load our tool on your mobile device or desktop browser, the client instantly loads and caches the modern interbank datasets locally. This means that if you are traveling abroad without cellular connectivity or are experiencing unstable network latency, you can still perform conversions using the last stored indices perfectly! 
            </p>
            <p className="text-xs sm:text-sm text-fx-text-dim leading-relaxed">
              Furthermore, when you toggle active pairs, the platform automatically refactors the URL path dynamically to <code>/convert/FROM-TO</code>. This facilitates immediate bookmarking of your key currency trackers and allows search engine bots to catalog individual page iterations index-by-index.
            </p>
          </div>

        </section>

        {/* Creator Showcase Banner */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-fx-panel/40 border border-fx-border/60 backdrop-blur-md">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-gray-200 font-bold font-sans text-sm sm:text-base">System Engineered & Curated</h3>
            <p className="text-fx-text-dim text-xs font-sans mt-1">
              Explore professional portfolio archives, engineering designs, and technical credentials of the system architect.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <GaneshBadge />
            <PortfolioButton />
          </div>
        </div>

        {/* 🌟 Custom High-Fidelity Branded Footer */}
        <footer className="border-t border-fx-border/60 py-12 mt-12 font-sans text-xs text-fx-text-dim">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-fx-accent rounded-sm flex items-center justify-center transform -skew-x-12">
                  <span className="text-fx-bg font-bold text-[10px] font-sans">/</span>
                </div>
                <span className="font-bold text-sm tracking-widest text-gray-200 uppercase font-mono">FX_CHECKER</span>
              </div>
              <p className="leading-relaxed hover:text-gray-300 transition-colors">
                Your premier full-stack, secure platform tracking global currency exchange rates, customized portfolio metrics, with real-time analytics and predictive Gemini AI insights. Built for ultimate speed and privacy.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-200 uppercase tracking-widest text-[10px]">Sitemap Directory</h4>
              <ul className="space-y-2 font-mono">
                <li>
                  <a 
                    href="/convert/USD-EUR" 
                    onClick={(e) => { e.preventDefault(); setActiveFrom('USD'); setActiveTo('EUR'); }}
                    className="hover:text-fx-accent transition-colors"
                  >
                    ↳ convert/USD-EUR
                  </a>
                </li>
                <li>
                  <a 
                    href="/convert/EUR-USD" 
                    onClick={(e) => { e.preventDefault(); setActiveFrom('EUR'); setActiveTo('USD'); }}
                    className="hover:text-fx-accent transition-colors"
                  >
                    ↳ convert/EUR-USD
                  </a>
                </li>
                <li>
                  <a 
                    href="/convert/GBP-USD" 
                    onClick={(e) => { e.preventDefault(); setActiveFrom('GBP'); setActiveTo('USD'); }}
                    className="hover:text-fx-accent transition-colors"
                  >
                    ↳ convert/GBP-USD
                  </a>
                </li>
                <li>
                  <a 
                    href="/convert/USD-INR" 
                    onClick={(e) => { e.preventDefault(); setActiveFrom('USD'); setActiveTo('INR'); }}
                    className="hover:text-fx-accent transition-colors"
                  >
                    ↳ convert/USD-INR
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-200 uppercase tracking-widest text-[10px]">Developer Attribution</h4>
              <p className="leading-relaxed">
                Authored, styled, and optimized with professional SEO and system-security directives by <strong>Ganesh Raikwar</strong>.
              </p>
              <div className="pt-2">
                <a 
                  href="https://github.com/ganeshhraikwar/FxChecker" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-fx-border/60 hover:bg-fx-accent hover:text-fx-bg border border-fx-border px-3 py-1.5 rounded-lg text-gray-200 transition-all font-mono active-press"
                >
                  📁 Source Code Repository
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-fx-border/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <p className="text-[10px]">
              &copy; {new Date().getFullYear()} FX Checker. Open-source under MIT Standards.
            </p>
            <div className="flex gap-4 text-[10px]">
              <span className="text-fx-accent">ECB indicatives • Indicative-Only</span>
              <span>•</span>
              <span className="hover:text-gray-200 transition-colors">Privacy Shield</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
