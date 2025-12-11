import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface UploadSectionProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 relative overflow-hidden">
      
      {/* Abstract Background Decoration */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Text Side */}
        <div className="flex-1 text-center md:text-left space-y-8 fade-in">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-semibold uppercase tracking-widest mb-2">
              AI Personal Stylist
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-stone-900 leading-[1.1]">
              Curate Your <br/><i className="font-light text-stone-400">Signature</i> Look.
            </h1>
            <p className="text-lg text-stone-500 max-w-md font-light leading-relaxed">
              Upload that one tricky piece from your wardrobe. We'll generate three complete, high-fashion ensembles tailored just for you.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-stone-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">01. Upload Item</span>
            <div className="h-px w-12 bg-stone-200"></div>
            <span className="flex items-center gap-2">02. AI Analysis</span>
            <div className="h-px w-12 bg-stone-200"></div>
            <span className="flex items-center gap-2">03. Get Styled</span>
          </div>
        </div>

        {/* Upload Side */}
        <div className="flex-1 w-full max-w-md fade-in" style={{animationDelay: '0.2s'}}>
          <div
            className={`
              relative group w-full aspect-[4/5] bg-white transition-all duration-500 ease-out
              ${dragActive ? 'scale-[1.02] shadow-2xl ring-1 ring-stone-900/10' : 'shadow-xl hover:shadow-2xl hover:-translate-y-1'}
              ${isProcessing ? 'opacity-90 pointer-events-none' : ''}
            `}
          >
            {/* Elegant Frame Borders */}
            <div className="absolute top-0 left-0 w-full h-full border-[12px] border-white z-20 pointer-events-none"></div>
            <div className="absolute top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] border border-stone-100 z-20 pointer-events-none"></div>

            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              onChange={handleChange}
              accept="image/*"
              disabled={isProcessing}
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-stone-50/50">
                <div className="w-20 h-20 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-8 h-8 text-stone-400 group-hover:text-stone-900 transition-colors" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-serif text-stone-900 mb-3">
                  Upload Item
                </h3>
                <p className="text-sm text-stone-500 mb-8 max-w-[200px] leading-relaxed">
                  Drag & drop your clothing item here, or click to browse.
                </p>

                <div className="flex items-center gap-2 text-xs text-stone-400 uppercase tracking-widest font-medium">
                  <ImageIcon size={12}/> JPG or PNG
                </div>
            </div>

            {/* Hover visual cue */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-40"></div>
          </div>
        </div>

      </div>
    </div>
  );
};