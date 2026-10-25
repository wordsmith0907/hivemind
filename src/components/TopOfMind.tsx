import React from 'react';
import { Pin, X } from 'lucide-react';
import { Card } from '../types/card';

interface TopOfMindProps {
  pinnedCards: Card[];
  onSelectCard: (card: Card) => void;
  onUnpinCard: (id: string, e: React.MouseEvent) => void;
}

export const TopOfMind: React.FC<TopOfMindProps> = ({
  pinnedCards,
  onSelectCard,
  onUnpinCard
}) => {
  if (pinnedCards.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 my-3">
      <div className="flex items-center gap-2 mb-2.5 text-[11px] font-semibold tracking-widest uppercase text-[#8a8782] dark:text-[#6e6c68]">
        <Pin className="w-3.5 h-3.5 text-[#FF5924] fill-[#FF5924]" />
        <span>Top of Mind</span>
        <span className="text-[10px] font-mono normal-case opacity-70">
          ({pinnedCards.length} memories)
        </span>
      </div>

      {/* Horizontal Carousel Shelf */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x">
        {pinnedCards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              className="flex-shrink-0 w-64 p-4 rounded-2xl bg-white dark:bg-[#1c1c1f] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] hover:border-[#FF5924]/50 dark:hover:border-[#FF5924]/50 card-shadow hover:card-shadow-hover cursor-pointer transition-all duration-200 group relative snap-start"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#FF5924]">
                  {card.type}
                </span>
                <button
                  onClick={(e) => onUnpinCard(card.id, e)}
                  title="Unpin from Top of Mind"
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#8a8782] hover:text-[#191919] dark:hover:text-[#f0f0ee] rounded-full hover:bg-[#f0eae1] dark:hover:bg-[#2e2e33] transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <h4 className="font-editorial text-sm font-medium text-[#191919] dark:text-[#f0f0ee] line-clamp-2 leading-snug group-hover:text-[#FF5924] transition-colors">
                {card.title}
              </h4>

              {card.excerpt && (
                <p className="mt-1 text-xs text-[#706e6b] dark:text-[#9c9994] line-clamp-1 font-body">
                  {card.excerpt}
                </p>
              )}

              {/* Color dots preview */}
              {card.colorPalette?.hexPalette && (
                <div className="flex items-center gap-1 mt-3">
                  {card.colorPalette.hexPalette.slice(0, 4).map((c, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full border border-black/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {card.readingTimeMinutes && (
                    <span className="text-[10px] text-[#9c9994] ml-auto font-mono">
                      {card.readingTimeMinutes}m
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
