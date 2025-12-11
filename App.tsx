import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { OutfitCard } from './components/OutfitCard';
import { EditorModal } from './components/EditorModal';
import { Outfit, AppState } from './types';
import { fileToBase64, generateOutfitImage, editOutfitImage } from './services/gemini';
import { Sparkles, RefreshCcw, ArrowLeft } from 'lucide-react';

const STYLES = ['Casual', 'Business', 'Night Out'] as const;

const LOADING_STEPS = [
  "Analyzing fabric texture & color palette...",
  "Identifying style attributes...",
  "Searching current fashion trends...",
  "Matching accessories & footwear...",
  "Composing final editorial look..."
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Cycle through loading steps
  useEffect(() => {
    let interval: number;
    if (appState === 'analyzing') {
      setLoadingStepIndex(0);
      interval = window.setInterval(() => {
        setLoadingStepIndex(prev => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleImageSelect = async (file: File) => {
    try {
      setAppState('analyzing');
      const base64 = await fileToBase64(file);
      setOriginalImage(base64);

      // Generate 3 outfits in parallel
      const outfitPromises = STYLES.map(async (style) => {
        const imageUrl = await generateOutfitImage(base64, style);
        return {
          id: crypto.randomUUID(),
          style,
          imageUrl,
          description: `A curated ${style.toLowerCase()} ensemble featuring your item, paired with matching accessories for a cohesive look.`,
          timestamp: Date.now(),
        } as Outfit;
      });

      const generatedOutfits = await Promise.all(outfitPromises);
      
      setOutfits(generatedOutfits);
      setAppState('results');
    } catch (error) {
      console.error(error);
      alert('Failed to generate outfits. Please try again.');
      setAppState('upload');
    }
  };

  const handleEditOutfit = async (outfitId: string, prompt: string) => {
    const outfitIndex = outfits.findIndex(o => o.id === outfitId);
    if (outfitIndex === -1) return;

    try {
      const currentOutfit = outfits[outfitIndex];
      const newImageUrl = await editOutfitImage(currentOutfit.imageUrl, prompt);

      const updatedOutfit = {
        ...currentOutfit,
        imageUrl: newImageUrl,
        description: `Refined: "${prompt}"`,
        timestamp: Date.now()
      };

      const newOutfits = [...outfits];
      newOutfits[outfitIndex] = updatedOutfit;
      setOutfits(newOutfits);
    } catch (error) {
      console.error("Edit failed", error);
      alert("Could not edit image. Please try a different prompt.");
    }
  };

  const handleReset = () => {
    setAppState('upload');
    setOriginalImage(null);
    setOutfits([]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-20">
        {appState === 'upload' && (
          <UploadSection 
            onImageSelect={handleImageSelect} 
            isProcessing={false} 
          />
        )}

        {appState === 'analyzing' && (
          <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-stone-200/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md text-center">
              <div className="w-24 h-24 mb-12 relative">
                 <div className="absolute inset-0 border border-stone-200 rounded-full"></div>
                 <div className="absolute inset-0 border border-t-stone-900 rounded-full animate-spin duration-1000"></div>
                 {originalImage && (
                    <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white shadow-inner">
                        <img src={`data:image/jpeg;base64,${originalImage}`} className="w-full h-full object-cover opacity-80" alt="Processing" />
                    </div>
                 )}
              </div>
              
              <h2 className="text-3xl font-serif text-stone-900 mb-4">Curating Your Look</h2>
              <div className="h-8 overflow-hidden">
                <p key={loadingStepIndex} className="text-stone-500 font-light tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {LOADING_STEPS[loadingStepIndex]}
                </p>
              </div>
            </div>
          </div>
        )}

        {appState === 'results' && (
          <div className="max-w-7xl mx-auto px-6 py-12 w-full animate-in fade-in duration-700">
             
             {/* Results Header */}
             <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-stone-200 pb-8">
                <div>
                  <button 
                    onClick={handleReset}
                    className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-medium mb-4"
                  >
                    <ArrowLeft size={14} />
                    Back to Upload
                  </button>
                  <h2 className="text-5xl font-serif text-stone-900 leading-tight">
                    The Collection
                  </h2>
                </div>
                
                {/* Original Item Thumbnail */}
                {originalImage && (
                   <div className="flex items-center gap-6 bg-white p-2 pr-6 rounded-full shadow-sm border border-stone-100">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-stone-100 bg-stone-50">
                        <img src={`data:image/jpeg;base64,${originalImage}`} className="w-full h-full object-cover" alt="Original" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Base Item</span>
                        <span className="text-sm font-serif text-stone-900 italic">Your Wardrobe Piece</span>
                      </div>
                   </div>
                )}
             </div>
             
             {/* Outfit Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-20">
               {outfits.map((outfit, idx) => (
                 <div key={outfit.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{animationDelay: `${idx * 150}ms`}}>
                   <OutfitCard 
                     outfit={outfit} 
                     onOpenEditor={(o) => {
                       setSelectedOutfit(o);
                       setIsEditorOpen(true);
                     }}
                   />
                 </div>
               ))}
             </div>

             <div className="text-center">
                <button 
                  onClick={handleReset}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all hover:px-10 duration-300"
                >
                  <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-medium tracking-wide">Style Another Item</span>
                </button>
             </div>
          </div>
        )}
      </main>

      {selectedOutfit && (
        <EditorModal 
          outfit={selectedOutfit}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onEdit={handleEditOutfit}
        />
      )}
    </div>
  );
}