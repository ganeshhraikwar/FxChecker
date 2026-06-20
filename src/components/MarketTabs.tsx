import React from 'react';
import { motion } from 'motion/react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface MarketTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function MarketTabs({ tabs, activeTab, onTabChange }: MarketTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-fx-border/50 uppercase tracking-widest text-xs pt-4 font-sans font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
      {tabs.map(tab => {
         const isActive = tab.id === activeTab;
         return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-4 relative transition-colors cursor-pointer active-press ${isActive ? 'text-gray-100 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="bg-fx-accent text-fx-bg font-bold rounded-full px-1.5 py-0.5 text-[9px] min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <motion.span 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-fx-accent rounded-t-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
         );
      })}
    </div>
  );
}
