import React from 'react';
import { Clock, BookOpen, ExternalLink } from 'lucide-react';
import { Card } from '../../types/card';

interface ArticleCardProps {
  card: Card;
  onOpenReadingMode: (card: Card, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ card, onOpenReadingMode }) => {
  return (
    <div>
      {card.thumbnailUrl && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EEE9DF] dark:bg-[#202127]">
          <img
            src={card.thumbnailUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {card.readingTimeMinutes && (
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-black/65 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3" />
              <span>{card.readingTimeMinutes} min read</span>
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 text-xs text-[#706E6B] dark:text-[#A3A19D]">
          {card.domain && (
            <span className="px-2 py-0.5 rounded-full bg-[#F0EAE1]/70 dark:bg-[#252528] font-medium text-[11px]">
              {card.domain}
            </span>
          )}
          {card.publishedAt && <span>{card.publishedAt}</span>}
        </div>
        <h3 className="font-editorial text-lg font-medium text-[#191919] dark:text-[#F5F4F2] leading-snug group-hover:text-[#FF5924] transition-colors">
          {card.title}
        </h3>
        {card.excerpt && (
          <p className="mt-2 text-xs text-[#706E6B] dark:text-[#A3A19D] line-clamp-2 leading-relaxed">
            {card.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
          <button
            onClick={(e) => onOpenReadingMode(card, e)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FF5924] hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reading Mode</span>
          </button>
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-[#9C9994] hover:text-[#191919] dark:hover:text-[#F5F4F2] transition-colors"
              title="Open source URL"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
