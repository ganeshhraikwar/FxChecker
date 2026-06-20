import React from 'react';
import { History, X } from 'lucide-react';
import { ConversionHistoryItem } from '../types';
import { formatCurrency } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface HistoryListProps {
  history: ConversionHistoryItem[];
  onClear: () => void;
}

export function HistoryList({ history, onClear }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <History size={16} /> Recent Activity
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your conversion history will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <History size={16} /> Recent Activity
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <X size={14} /> Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {history.slice(0, 50).map(item => (
          <div key={item.id} className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/50">
            <div className="flex justify-between items-center mb-1">
              <div className="font-mono text-sm">
                <span className="text-gray-300">{formatCurrency(item.amount, item.from)}</span>
                <span className="mx-2 text-gray-600">→</span>
                <span className="text-indigo-400 font-semibold">{formatCurrency(item.result, item.to)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-600">
               <span>Rate: {item.rate.toFixed(4)}</span>
               {/* <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span> */}
               <span suppressHydrationWarning>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
