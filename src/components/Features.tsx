import React from 'react';
import { Zap, Shield, Globe2, Bot } from 'lucide-react';

const features = [
  {
    icon: <Globe2 className="w-6 h-6 text-indigo-400" />,
    title: "Real-time Market Rates",
    description: "Get up-to-the-second exchange rates for over 150 global currencies, powered by enterprise-grade APIs."
  },
  {
    icon: <Bot className="w-6 h-6 text-violet-400" />,
    title: "AI Financial Assistant",
    description: "Ask our Gemini-powered AI about market trends, historical data, or the best time to transfer your money."
  },
  {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Lightning Fast",
      description: "Instantly convert currencies with zero lag. Our optimized engine ensures your conversions happen in milliseconds."
  },
  {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Secure & Private",
      description: "Your conversion history and favorite pairs are stored securely. We respect your privacy and data."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-950 relative border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">Why Choose CurrencyX</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Everything you need for global finance.</h3>
          <p className="text-lg text-gray-400">Experience the next generation of currency conversion with premium features designed for both personal and business use.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-indigo-500/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-100 mb-3">{f.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
