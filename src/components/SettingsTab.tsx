import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function SettingsTab() {
  const [baseCurrency, setBaseCurrency] = useLocalStorage('fx-base-currency', 'EUR');
  const [theme, setTheme] = useLocalStorage('fx-theme', 'Dark');

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all app data? This includes favorites, history, alerts, and portfolio.")) {
       localStorage.clear();
       window.location.reload();
    }
  };

  return (
    <div className="bg-fx-panel border border-fx-border rounded-2xl p-6">
      <h3 className="text-gray-300 tracking-widest text-xs uppercase mb-6">Settings</h3>
      
      <div className="space-y-6 max-w-sm">
         <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Default Base Currency</label>
            <input 
              type="text" 
              value={baseCurrency}
              onChange={e => setBaseCurrency(e.target.value.toUpperCase())}
              maxLength={3}
              className="bg-[#1b1b1e] border border-fx-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fx-accent transition-colors"
            />
         </div>

         <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Theme Preference</label>
            <select 
               value={theme}
               onChange={e => setTheme(e.target.value)}
               className="bg-[#1b1b1e] border border-fx-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fx-accent transition-colors appearance-none"
            >
               <option value="Dark">Dark Mode (Default)</option>
               <option value="Light">Light Mode (Coming Soon)</option>
            </select>
         </div>

         <div className="pt-8 border-t border-fx-border/50">
            <h4 className="text-fx-negative text-sm font-bold mb-4">Danger Zone</h4>
            <button 
               onClick={handleClearAll}
               className="px-6 py-3 border border-fx-negative text-fx-negative hover:bg-fx-negative/10 rounded-lg text-sm tracking-widest uppercase font-bold transition-colors w-full text-left"
            >
               Clear All Local Data
            </button>
         </div>
      </div>
    </div>
  );
}
