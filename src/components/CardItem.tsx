import React from 'react';
import { Card } from '../types/card';
import { CardActionRibbon } from './cards/CardActionRibbon';
import { ColorSwatchStrip } from './cards/ColorSwatchStrip';
import { QuoteCard } from './cards/QuoteCard';
import { NoteCard } from './cards/NoteCard';
import { ArticleCard } from './cards/ArticleCard';
import { ProductCard } from './cards/ProductCard';
import { TodoCard } from './cards/TodoCard';
import { BookCard } from './cards/BookCard';
import { ImageCard } from './cards/ImageCard';
import { CodeCard } from './cards/CodeCard';

interface CardItemProps {
  card: Card;
  onSelect: (card: Card) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onOpenSameVibe: (card: Card, e: React.MouseEvent) => void;
  onOpenReadingMode: (card: Card, e: React.MouseEvent) => void;
  onOpenWhyTag: (card: Card, e: React.MouseEvent) => void;
  onToggleTodoItem?: (cardId: string, itemId: string, e: React.MouseEvent) => void;
  onNavigateMindLink?: (targetTitle: string, e: React.MouseEvent) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onDelete,
  onOpenSameVibe,
  onOpenReadingMode,
  onOpenWhyTag,
  onToggleTodoItem,
  onNavigateMindLink
}) => {
  return (
    <div
      onClick={() => onSelect(card)}
      className="masonry-item group relative rounded-2xl bg-white dark:bg-[#1A1A1D] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,0,0,0.12)] dark:hover:border-[rgba(255,255,255,0.15)] card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Action Ribbon on Hover */}
      <CardActionRibbon
        card={card}
        onOpenSameVibe={onOpenSameVibe}
        onOpenWhyTag={onOpenWhyTag}
        onTogglePin={onTogglePin}
        onToggleFavorite={onToggleFavorite}
        onDelete={onDelete}
      />

      {/* Type-Specific Rendering */}
      {card.type === 'quote' && <QuoteCard card={card} />}
      {card.type === 'note' && <NoteCard card={card} onNavigateMindLink={onNavigateMindLink} />}
      {card.type === 'article' && <ArticleCard card={card} onOpenReadingMode={onOpenReadingMode} />}
      {card.type === 'product' && <ProductCard card={card} />}
      {card.type === 'todo' && <TodoCard card={card} onToggleTodoItem={onToggleTodoItem} />}
      {card.type === 'book' && <BookCard card={card} />}
      {card.type === 'image' && <ImageCard card={card} />}
      {card.type === 'code' && <CodeCard card={card} />}

      {/* Extracted 5-Color Resonance Swatches */}
      <ColorSwatchStrip colorPalette={card.colorPalette} />

      {/* Card Tags Ribbon Footer */}
      {card.tags && card.tags.length > 0 && (
        <div className="px-4 py-2.5 bg-white dark:bg-[#1A1A1D] flex flex-wrap gap-1">
          {card.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F0EAE1]/60 dark:bg-[#252528] text-[#55524D] dark:text-[#A09E99]"
            >
              #{tag.name}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="text-[10px] text-[#9C9994] self-center ml-0.5 font-mono">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
