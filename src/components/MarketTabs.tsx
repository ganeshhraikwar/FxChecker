import React from 'react';

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
    <div className="flex items-center gap-6 border-b border-fx-border/50 uppercase tracking-widest text-xs pt-4 font-sans font-medium">
      {tabs.map(tab => {
         const isActive = tab.id === activeTab;
         return (
           <button
             key={tab.id}
             onClick={() => onTabChange(tab.id)}
             className={`pb-4 relative transition-colors ${isActive ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300'}`}
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
               <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-gray-100 rounded-t-full"></span>
             )}
           </button>
         );
      })}
    </div>
  );
}
