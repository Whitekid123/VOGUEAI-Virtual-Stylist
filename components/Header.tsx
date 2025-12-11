import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/60 border-b border-stone-100/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
             <div className="absolute inset-0 bg-stone-200 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative p-2.5 bg-stone-900 text-white rounded-full">
               <ShoppingBag size={18} strokeWidth={2} />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-serif tracking-tight text-stone-900 leading-none">VOGUE<span className="font-sans font-light italic text-stone-500 ml-1">AI</span></span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-400 font-medium mt-1">Virtual Stylist</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 text-sm font-medium text-stone-500">
          <span className="hidden md:inline-block text-xs uppercase tracking-widest opacity-60">Powered by Gemini 2.5</span>
          <button className="flex items-center gap-2 text-stone-900 hover:text-stone-600 transition-colors px-4 py-2 rounded-full border border-stone-200 hover:bg-white hover:shadow-sm bg-white/50 backdrop-blur-sm">
            <Sparkles size={14} />
            <span>New Collection</span>
          </button>
        </nav>
      </div>
    </header>
  );
};