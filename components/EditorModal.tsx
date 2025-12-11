import React, { useState } from 'react';
import { X, Wand2, Loader2, Send } from 'lucide-react';
import { Outfit } from '../types';

interface EditorModalProps {
  outfit: Outfit;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (outfitId: string, prompt: string) => Promise<void>;
}

export const EditorModal: React.FC<EditorModalProps> = ({ outfit, isOpen, onClose, onEdit }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsEditing(true);
    await onEdit(outfit.id, prompt);
    setIsEditing(false);
    setPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <h3 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Wand2 size={18} className="text-stone-500"/>
            Refine Look
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="relative aspect-square rounded-xl overflow-hidden mb-6 bg-stone-50">
             <img 
               src={outfit.imageUrl} 
               alt="Outfit to edit" 
               className="w-full h-full object-cover"
             />
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="edit-prompt" className="block text-sm font-medium text-stone-700 mb-2">
              What would you like to change?
            </label>
            <div className="relative">
              <input
                id="edit-prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Add a red scarf', 'Change the shoes to boots'"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
                disabled={isEditing}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isEditing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
              >
                {isEditing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-2">
              Powered by Gemini 2.5 Flash Image editing capabilities.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
