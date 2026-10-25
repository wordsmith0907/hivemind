import React from 'react';
import { Card } from '../../types/card';

interface ProductCardProps {
  card: Card;
}

export const ProductCard: React.FC<ProductCardProps> = ({ card }) => {
  return (
    <div>
      {card.thumbnailUrl && (
        <div className="relative aspect-square w-full p-6 bg-[#FCFAF7] dark:bg-[#161618] flex items-center justify-center overflow-hidden">
          <img
            src={card.thumbnailUrl}
            alt={card.title}
            className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {card.metadata?.product?.price && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#191919] dark:bg-[#FCFAF7] text-white dark:text-[#191919] shadow-md">
              {card.metadata.product.currency === 'EUR' ? '€' : '$'}
              {card.metadata.product.price}
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8A8782] dark:text-[#A3A19D]">
          {card.metadata?.product?.merchant || card.domain || 'Product'}
        </span>
        <h3 className="font-body text-sm font-medium text-[#191919] dark:text-[#F5F4F2] mt-1 leading-snug">
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
