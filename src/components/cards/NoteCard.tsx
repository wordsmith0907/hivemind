import React from 'react';
import { Link2 } from 'lucide-react';
import { Card } from '../../types/card';

interface NoteCardProps {
  card: Card;
  onNavigateMindLink?: (targetTitle: string, e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ card, onNavigateMindLink }) => {
  // Parse [[Mind Links]] inside note text
  const renderContentWithMindLinks = (text: string) => {
    const parts = text.split(/(\[\[.*?\]\])/g);
    return parts.map((part, idx) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkTitle = part.slice(2, -2);
        return (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              onNavigateMindLink?.(linkTitle, e);
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 text-xs font-medium rounded-full bg-[#E8E4DB] dark:bg-[#333338] text-[#191919] dark:text-[#F0F0EE] hover:bg-[#FF5924] hover:text-white dark:hover:bg-[#FF5924] dark:hover:text-white transition-colors"
          >
            <Link2 className="w-2.5 h-2.5 opacity-70" />
            <span>{linkTitle}</span>
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="p-6 paper-note border-l-4 border-[#FFE926]">
      <h3 className="font-editorial text-lg font-medium text-[#191919] dark:text-[#FEF3C7] leading-snug">
        {card.title}
      </h3>
      <div className="mt-2.5 text-xs text-[#44423E] dark:text-[#D4CEBD] leading-relaxed whitespace-pre-wrap font-body">
        {renderContentWithMindLinks(card.content)}
      </div>
    </div>
  );
};
