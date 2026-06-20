import React from 'react';
import { Globe2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Globe2 size={24} className="text-indigo-500" />
                <span className="text-2xl font-bold text-white tracking-tight">CurrencyX</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
                The most advanced currency converter and financial toolkit. Empowering your global transactions with real-time data and AI assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Converter</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Live Rates</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API Access</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-100 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-900 text-center md:text-left text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} CurrencyX Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
    </footer>
  );
}
