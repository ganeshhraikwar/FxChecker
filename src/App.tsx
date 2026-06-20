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
  
  const getInitialParam = (key: string, backup: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get(key) || backup;
    }
    return backup;
  };

  const [activeFrom, setActiveFrom] = useState(() => getInitialParam('from', 'EUR'));
  const [activeTo, setActiveTo] = useState(() => getInitialParam('to', 'USD'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('from', activeFrom);
    params.set('to', activeTo);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [activeFrom, activeTo]);

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
        setActiveFrom={setActiveFrom}
        setActiveTo={setActiveTo}
      />
      <Chatbot context={`Viewing ${activeFrom} vs ${activeTo}`} />
    </div>
  );
}

