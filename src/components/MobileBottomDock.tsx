import React from 'react';
import { Compass, Sparkles, Plus, Search, LayoutGrid } from 'lucide-react';

interface MobileBottomDockProps {
  onOpenQuickSave: () => void;
  onOpenSerendipity: () => void;
  onOpenAskLibrary: () => void;
  onFocusSearch: () => void;
  isCanvasActive: boolean;
  onToggleCanvas: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  onOpenQuickSave,
  onOpenSerendipity,
  onOpenAskLibrary,
  onFocusSearch,
  isCanvasActive,
  onToggleCanvas
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden flex items-center justify-around py-2.5 px-4 rounded-full liquid-glass shadow-2xl border border-[rgba(255,255,255,0.6)] dark:border-[rgba(255,255,255,0.1)]">
      {/* Search Trigger */}
      <button
        onClick={onFocusSearch}
        className="p-2 text-[#706E6B] dark:text-[#A3A19D] hover:text-[#FF5924] active:scale-95 transition-transform"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Serendipity */}
      <button
        onClick={onOpenSerendipity}
        className="p-2 text-[#706E6B] dark:text-[#A3A19D] hover:text-[#FF5924] active:scale-95 transition-transform"
        aria-label="Serendipity"
      >
        <Compass className="w-5 h-5" />
      </button>

      {/* Primary Center Remember Action */}
      <button
        onClick={onOpenQuickSave}
        className="w-11 h-11 rounded-full bg-[#191919] dark:bg-[#FCFAF7] text-white dark:text-[#191919] flex items-center justify-center shadow-lg active:scale-90 transition-transform -my-1"
        aria-label="Remember New Memory"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Ask Mind */}
      <button
        onClick={onOpenAskLibrary}
        className="p-2 text-[#706E6B] dark:text-[#A3A19D] hover:text-[#FFE926] active:scale-95 transition-transform"
        aria-label="Ask Mind"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Canvas / Grid toggle */}
      <button
        onClick={onToggleCanvas}
        className={`p-2 rounded-full transition-all ${
          isCanvasActive 
            ? 'text-[#FF5924]' 
            : 'text-[#706E6B] dark:text-[#A3A19D]'
        }`}
        aria-label="Toggle Canvas or Grid"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
};
