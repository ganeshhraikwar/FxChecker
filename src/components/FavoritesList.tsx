import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { FavoritePair } from '../types';

interface FavoritesListProps {
  favorites: FavoritePair[];
  onSelect: (pair: FavoritePair) => void;
  onRemove: (pair: FavoritePair) => void;
}

export function FavoritesList({ favorites, onSelect, onRemove }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Star size={16} className="text-yellow-500/50" /> Saved Pairs
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          You haven't saved any pairs yet. Click the star icon on the converter to save your frequent routes here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full flex flex-col">
       <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Star size={16} className="text-yellow-500" /> Saved Pairs
        </h3>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {favorites.map(pair => (
            <div 
              key={pair.id}
              className="flex items-center justify-between group bg-gray-950 p-3 rounded-xl border border-gray-800/50 hover:border-indigo-500/30 transition-colors cursor-pointer"
              onClick={() => onSelect(pair)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-mono text-gray-200">
                  <span className="font-semibold">{pair.from}</span>
                  <ArrowRight size={14} className="text-gray-600" />
                  <span className="font-semibold">{pair.to}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(pair);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 transition-all rounded-md hover:bg-red-400/10"
              >
                <Star size={16} className="fill-current" />
              </button>
            </div>
          ))}
        </div>
    </div>
  );
}
