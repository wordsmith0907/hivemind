import React from 'react';
import { Sparkles, Info, Pin, Heart, Trash2 } from 'lucide-react';
import { Card } from '../../types/card';

interface CardActionRibbonProps {
  card: Card;
  onOpenSameVibe: (card: Card, e: React.MouseEvent) => void;
  onOpenWhyTag: (card: Card, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const CardActionRibbon: React.FC<CardActionRibbonProps> = ({
  card,
  onOpenSameVibe,
  onOpenWhyTag,
  onTogglePin,
  onToggleFavorite,
  onDelete
}) => {
  return (
    <div 
      className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-[#202127]/95 p-1 rounded-full shadow-md backdrop-blur-md border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Same Vibe */}
      <button
        onClick={(e) => onOpenSameVibe(card, e)}
        title="Find Same Vibe (Visual & Conceptual Similarity)"
        className="p-1 rounded-full text-[#706E6B] dark:text-[#A3A19D] hover:text-[#FF5924] hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38] transition-all"
        aria-label="Find same vibe"
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>

      {/* Why this tag? AI Inspector */}
      <button
        onClick={(e) => onOpenWhyTag(card, e)}
        title="Why this tag? (AI Reasoning)"
        className="p-1 rounded-full text-[#706E6B] dark:text-[#A3A19D] hover:text-[#FFE926] hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38] transition-all"
        aria-label="Inspect AI reasoning"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {/* Pin to Top of Mind */}
      <button
        onClick={(e) => onTogglePin(card.id, e)}
        title={card.isPinned ? 'Unpin' : 'Pin to Top of Mind'}
        className={`p-1 rounded-full transition-all ${
          card.isPinned 
            ? 'text-[#FFE926] hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38]' 
            : 'text-[#706E6B] dark:text-[#A3A19D] hover:text-[#FFE926] hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38]'
        }`}
        aria-label={card.isPinned ? "Unpin card" : "Pin card"}
      >
        <Pin className={`w-3.5 h-3.5 ${card.isPinned ? 'fill-[#FFE926]' : ''}`} />
      </button>

      {/* Favorite */}
      <button
        onClick={(e) => onToggleFavorite(card.id, e)}
        title={card.isFavorite ? 'Unfavorite' : 'Favorite'}
        className={`p-1 rounded-full transition-all ${
          card.isFavorite 
            ? 'text-[#E11D48] hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38]' 
            : 'text-[#706E6B] dark:text-[#A3A19D] hover:text-[#E11D48] hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38]'
        }`}
        aria-label={card.isFavorite ? "Unfavorite card" : "Favorite card"}
      >
        <Heart className={`w-3.5 h-3.5 ${card.isFavorite ? 'fill-[#E11D48]' : ''}`} />
      </button>

      {/* Delete / Archive */}
      <button
        onClick={(e) => onDelete(card.id, e)}
        title="Archive or Delete"
        className="p-1 rounded-full text-[#706E6B] dark:text-[#A3A19D] hover:text-red-500 hover:bg-[#F0EAE1] dark:hover:bg-[#2E2F38] transition-all"
        aria-label="Delete card"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
