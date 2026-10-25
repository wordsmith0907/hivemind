import React, { useState, useEffect } from 'react';
import { X, Sparkles, Compass, Check, ArrowRight, Trash2, Heart } from 'lucide-react';
import { Card } from '../types/card';
import confetti from 'canvas-confetti';

interface SerendipityModalProps {
  cards: Card[];
  isOpen: boolean;
  onClose: () => void;
  onKeepCard: (card: Card) => void;
  onArchiveCard: (card: Card) => void;
}

export const SerendipityModal: React.FC<SerendipityModalProps> = ({
  cards,
  isOpen,
  onClose,
  onKeepCard,
  onArchiveCard
}) => {
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'right' | 'left' | null>(null);

  useEffect(() => {
    if (isOpen && cards.length > 0) {
      // Shuffle cards for true serendipity
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setCurrentIndex(0);
    }
  }, [isOpen, cards]);

  const currentCard = shuffledCards[currentIndex];

  const handleKeep = () => {
    if (!currentCard || isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    onKeepCard(currentCard);

    // Celebration particles with authentic Mymind palette
    confetti({
      particleCount: 28,
      spread: 55,
      origin: { y: 0.7, x: 0.6 },
      colors: ['#FF5924', '#FFE926', '#FF7DD3', '#5CB13E']
    });

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
      setDirection(null);
    }, 300);
  };

  const handleLetGo = () => {
    if (!currentCard || isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    onArchiveCard(currentCard);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
      setDirection(null);
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleKeep();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLetGo();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, currentCard, isAnimating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-gradient-to-tr from-[#F4EBD9]/85 via-[#FCFAF7] to-[#EEDFCE]/80 dark:from-[#121214] dark:via-[#161619] dark:to-[#121214] backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Top Controls */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF5924]/15 text-[#FF5924] flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-editorial text-lg font-medium text-[#191919] dark:text-[#F5F4F2]">
              Serendipity
            </h3>
            <span className="text-[11px] font-mono text-[#748297] dark:text-[#A3A19D]">
              {shuffledCards.length > 0 ? `${currentIndex + 1} of ${shuffledCards.length} memories` : 'Resting'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full text-[#748297] hover:text-[#191919] dark:hover:text-[#F5F4F2] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Stage: The Resurfaced Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        {currentCard ? (
          <div 
            className={`w-full max-w-md transition-all duration-300 transform ${
              direction === 'right' 
                ? 'translate-x-32 rotate-6 opacity-0' 
                : direction === 'left' 
                ? '-translate-x-32 -rotate-6 opacity-0' 
                : 'translate-x-0 rotate-0 opacity-100 scale-100'
            }`}
          >
            <div className="p-1 rounded-[28px] bg-gradient-to-tr from-[#FF5924]/20 via-[#FFE926]/20 to-[#FF7DD3]/20 shadow-2xl">
              <div className="bg-white dark:bg-[#1C1C1F] rounded-[24px] overflow-hidden border border-[rgba(0,0,0,0.06)] dark:border-[#2E2E33]">
                {/* Visual Cover if applicable */}
                {currentCard.thumbnailUrl && (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#EEE9DF]">
                    <img
                      src={currentCard.thumbnailUrl}
                      alt={currentCard.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#FF5924] px-2.5 py-0.5 rounded-full bg-[#FF5924]/10">
                      {currentCard.type}
                    </span>
                    {currentCard.domain && (
                      <span className="text-xs text-[#748297] dark:text-[#A3A19D] font-body">
                        {currentCard.domain}
                      </span>
                    )}
                  </div>

                  <h2 className="font-editorial text-2xl font-medium text-[#191919] dark:text-[#F5F4F2] leading-snug">
                    {currentCard.title}
                  </h2>

                  {currentCard.content && (
                    <p className="mt-3 text-sm text-[#55524D] dark:text-[#A3A19D] font-body line-clamp-4 leading-relaxed">
                      {currentCard.content}
                    </p>
                  )}

                  {/* Palette Swatches */}
                  {currentCard.colorPalette?.hexPalette && (
                    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)] dark:border-[#2E2E33]">
                      {currentCard.colorPalette.hexPalette.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <span className="text-[11px] text-[#9C9994] dark:text-[#6E6C68] ml-auto font-mono">
                        Saved in your oasis
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="font-editorial text-3xl font-medium text-[#191919] dark:text-[#F5F4F2]">
              All caught up
            </h3>
            <p className="mt-2 text-sm text-[#748297] dark:text-[#A3A19D] font-body">
              You have revisited every serendipitous thought for now.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#191919] text-white dark:bg-[#FCFAF7] dark:text-[#191919] text-xs font-btn shadow-sm hover:scale-105 transition-all"
            >
              Return to Mind
            </button>
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Let Go vs Keep */}
      {currentCard && (
        <div className="w-full max-w-md mx-auto flex items-center justify-between pb-6 z-10">
          <button
            onClick={handleLetGo}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#252528] text-[#748297] hover:text-[#E11D48] border border-[rgba(0,0,0,0.08)] dark:border-[#333338] shadow-md hover:shadow-lg hover:scale-105 transition-all text-xs font-btn"
          >
            <Trash2 className="w-4 h-4" />
            <span>Let Go (L)</span>
          </button>

          <button
            onClick={handleKeep}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#191919] hover:bg-[#2E2E2E] dark:bg-[#FCFAF7] dark:hover:bg-[#E8E6E1] text-white dark:text-[#191919] shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xs font-btn"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Keep in Mind (Space)</span>
          </button>
        </div>
      )}
    </div>
  );
};
