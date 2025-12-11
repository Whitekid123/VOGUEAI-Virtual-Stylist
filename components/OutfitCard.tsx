import React from 'react';
import { Outfit } from '../types';
import { Wand2, Download, Share2 } from 'lucide-react';

interface OutfitCardProps {
  outfit: Outfit;
  onOpenEditor: (outfit: Outfit) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onOpenEditor }) => {
  return (
    <div className="group flex flex-col gap-4">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 shadow-sm transition-all duration-700 hover:shadow-2xl">
        <img
          src={outfit.imageUrl}
          alt={`${outfit.style} Outfit`}
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
        />
        
        {/* Elegant Overlay */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500 flex flex-col justify-end p-6">
           <button
             onClick={() => onOpenEditor(outfit)}
             className="w-full bg-white/95 backdrop-blur-md text-stone-900 py-4 font-medium text-xs uppercase tracking-widest shadow-lg hover:bg-stone-900 hover:text-white transition-all transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 ease-out flex items-center justify-center gap-3"
           >
             <Wand2 size={14} />
             Customize Look
           </button>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="space-y-2 text-center group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex items-center justify-center gap-2">
           <div className="h-px w-4 bg-stone-300"></div>
           <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
            {outfit.style} Edition
          </span>
           <div className="h-px w-4 bg-stone-300"></div>
        </div>
        
        <h3 className="font-serif text-2xl text-stone-900">
          The {outfit.style} Edit
        </h3>
        
        <p className="text-stone-500 text-sm leading-relaxed font-light line-clamp-2 max-w-xs mx-auto">
          {outfit.description}
        </p>
      </div>
    </div>
  );
};