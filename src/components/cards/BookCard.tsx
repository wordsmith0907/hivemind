import React from 'react';
import { Card } from '../../types/card';

interface BookCardProps {
  card: Card;
}

export const BookCard: React.FC<BookCardProps> = ({ card }) => {
  return (
    <div className="flex flex-col">
      {card.thumbnailUrl && (
        <div className="aspect-[2/3] w-full overflow-hidden bg-[#EEE9DF] dark:bg-[#202127]">
          <img
            src={card.thumbnailUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8A8782] dark:text-[#A3A19D]">
          Book · {card.metadata?.book?.author || card.author || 'Author'}
        </span>
        <h3 className="font-editorial text-base font-medium text-[#191919] dark:text-[#F5F4F2] mt-1 leading-snug">
          {card.title}
        </h3>
        {card.excerpt && (
          <p className="mt-1.5 text-xs text-[#706E6B] dark:text-[#A3A19D] line-clamp-2">
            {card.excerpt}
          </p>
        )}
      </div>
    </div>
  );
};
