import React from 'react';
import { Globe2, Menu } from 'lucide-react';

export function Navbar() {
  return (
    <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CurrencyX</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#converter" className="hover:text-white transition-colors">Converter</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#markets" className="hover:text-white transition-colors">Markets</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</button>
          <button className="bg-white text-gray-950 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">Get Started</button>
          <button className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
