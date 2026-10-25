import React from 'react';
import { Card } from '../types/card';
import { CardItem } from './CardItem';
import { Sparkles, Plus } from 'lucide-react';

interface DeckGridProps {
  cards: Card[];
  isGridFaded: boolean;
  onSelectCard: (card: Card) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onDeleteCard: (id: string, e: React.MouseEvent) => void;
  onOpenSameVibe: (card: Card, e: React.MouseEvent) => void;
  onOpenReadingMode: (card: Card, e: React.MouseEvent) => void;
  onOpenWhyTag: (card: Card, e: React.MouseEvent) => void;
  onToggleTodoItem?: (cardId: string, itemId: string, e: React.MouseEvent) => void;
  onNavigateMindLink?: (targetTitle: string, e: React.MouseEvent) => void;
  onOpenQuickSave: () => void;
}

export const DeckGrid: React.FC<DeckGridProps> = ({
  cards,
  isGridFaded,
  onSelectCard,
  onToggleFavorite,
  onTogglePin,
  onDeleteCard,
  onOpenSameVibe,
  onOpenReadingMode,
  onOpenWhyTag,
  onToggleTodoItem,
  onNavigateMindLink,
  onOpenQuickSave
}) => {
  if (cards.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto py-24 px-6 text-center animate-in fade-in duration-300">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#f0eae1]/60 dark:bg-[#252528] flex items-center justify-center text-[#FF5924] mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-editorial text-2xl font-medium text-[#191919] dark:text-[#F5F4F2]">
          No memories found
        </h3>
        <p className="mt-2 text-sm text-[#748297] dark:text-[#A3A19D] font-body leading-relaxed max-w-sm mx-auto">
          Nothing in your mind matches this search query or filter. Try a broader term, or remember something new.
        </p>
        <button
          onClick={onOpenQuickSave}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#191919] text-white dark:bg-[#FCFAF7] dark:text-[#191919] text-xs font-btn shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Save a New Memory</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-7xl mx-auto px-6 md:px-12 my-6 transition-all duration-300 ${
      isGridFaded ? 'opacity-25 blur-[1.5px] pointer-events-none' : 'opacity-100'
    }`}>
      <div className="masonry-grid">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onSelect={onSelectCard}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDelete={onDeleteCard}
            onOpenSameVibe={onOpenSameVibe}
            onOpenReadingMode={onOpenReadingMode}
            onOpenWhyTag={onOpenWhyTag}
            onToggleTodoItem={onToggleTodoItem}
            onNavigateMindLink={onNavigateMindLink}
          />
        ))}
      </div>
    </div>
  );
};
