import React from 'react';
import { Card } from '../../types/card';

interface QuoteCardProps {
  card: Card;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ card }) => {
  return (
    <div className="p-6 md:p-7 bg-[#FCFAF7] dark:bg-[#18181B] flex flex-col justify-between min-h-[190px]">
      <div>
        <span className="font-editorial text-4xl text-[#FF5924]/25 dark:text-[#FF5924]/30 leading-none select-none block mb-1">
          “
        </span>
        <p className="font-editorial-italic text-xl md:text-2xl text-[#191919] dark:text-[#F5F4F2] leading-[1.45] tracking-tight">
          {card.content}
        </p>
      </div>
      <div className="mt-5 pt-3.5 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest font-semibold text-[#706E6B] dark:text-[#A3A19D]">
          — {card.metadata?.quote?.author || card.author || 'Unknown'}
        </span>
        {card.metadata?.quote?.sourceTitle && (
          <span className="text-[11px] font-editorial italic text-[#9C9994] dark:text-[#6E6C68] truncate max-w-[150px]">
            {card.metadata.quote.sourceTitle}
          </span>
        )}
      </div>
    </div>
  );
};
