import React from 'react';
import { Card } from '../../types/card';

interface ImageCardProps {
  card: Card;
}

export const ImageCard: React.FC<ImageCardProps> = ({ card }) => {
  return (
    <div>
      {card.thumbnailUrl && (
        <div className="w-full overflow-hidden bg-[#EEE9DF] dark:bg-[#202127]">
          <img
            src={card.thumbnailUrl}
            alt={card.title}
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-editorial text-sm font-medium text-[#191919] dark:text-[#F5F4F2]">
          {card.title}
        </h3>
        {card.excerpt && (
          <p className="mt-1 text-xs text-[#706E6B] dark:text-[#A3A19D] line-clamp-1">
            {card.excerpt}
          </p>
        )}
      </div>
    </div>
  );
};
