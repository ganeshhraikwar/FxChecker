import React, { useState, useEffect } from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';
import { Chatbot } from './components/Chatbot';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FavoritePair, ConversionHistoryItem } from './types';
import { Terminal, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardLayout } from './components/DashboardLayout';

export default function App() {
  const [favorites, setFavorites] = useLocalStorage<FavoritePair[]>('currency-favorites', []);
  const [history, setHistory] = useLocalStorage<ConversionHistoryItem[]>('currency-history', []);
  
  const getInitialParams = () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/convert\/([A-Za-z]{3})-([A-Za-z]{3})/);
      if (match && match[1] && match[2]) {
        return {
          from: match[1].toUpperCase(),
          to: match[2].toUpperCase()
        };
      }
      
      const params = new URLSearchParams(window.location.search);
      const fromParam = params.get('from');
      const toParam = params.get('to');
      if (fromParam && toParam) {
        return { 
          from: fromParam.toUpperCase(), 
          to: toParam.toUpperCase(),
          hasParams: true
        };
      }
    }
    return { from: 'EUR', to: 'USD', hasParams: false };
  };

  const initialParams = getInitialParams();
  const [activeFrom, setActiveFrom] = useState(initialParams.from);
  const [activeTo, setActiveTo] = useState(initialParams.to);
  const [shouldUpdateUrl, setShouldUpdateUrl] = useState(initialParams.hasParams);

  useEffect(() => {
    if (shouldUpdateUrl) {
      const newPath = `/convert/${activeFrom.toUpperCase()}-${activeTo.toUpperCase()}`;
      if (window.location.pathname !== newPath) {
        window.history.replaceState(null, '', newPath);
      }
    }
  }, [activeFrom, activeTo, shouldUpdateUrl]);

  const handleToggleFavorite = (pair: FavoritePair) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.from === pair.from && p.to === pair.to);
      if (exists) {
        return prev.filter(p => p.id !== exists.id);
      } else {
        return [...prev, pair];
      }
    });
  };

  const handleSelectFavorite = (pair: FavoritePair) => {
    setActiveFrom(pair.from);
    setActiveTo(pair.to);
    setShouldUpdateUrl(true);
  };

  const handleConvert = (item: ConversionHistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 100)); // Keep last 100
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-fx-bg flex flex-col font-sans text-gray-100 overflow-x-hidden selection:bg-fx-accent/30">
      <DashboardLayout
        favorites={favorites}
        history={history}
        activeFrom={activeFrom}
        activeTo={activeTo}
        onToggleFavorite={handleToggleFavorite}
        onSelectFavorite={handleSelectFavorite}
        onConvert={handleConvert}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        setActiveFrom={(val) => {
          setActiveFrom(val);
          setShouldUpdateUrl(true);
        }}
        setActiveTo={(val) => {
          setActiveTo(val);
          setShouldUpdateUrl(true);
        }}
      />
      <Chatbot context={`Viewing ${activeFrom} vs ${activeTo}`} />
    </div>
  );
}

