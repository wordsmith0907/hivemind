import React, { useState } from 'react';
import { X, BookOpen, Clock, ExternalLink, Type, Sun, Moon, Coffee } from 'lucide-react';
import { Card } from '../types/card';

interface ReadingModeModalProps {
  card: Card | null;
  onClose: () => void;
}

export const ReadingModeModal: React.FC<ReadingModeModalProps> = ({ card, onClose }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [theme, setTheme] = useState<'sepia' | 'light' | 'dark'>('sepia');

  if (!card) return null;

  const fontClasses = {
    normal: 'text-lg md:text-[20px] leading-[1.8]',
    large: 'text-xl md:text-[23px] leading-[1.85]',
    huge: 'text-2xl md:text-[26px] leading-[1.9]'
  }[fontSize];

  const themeClasses = {
    sepia: 'bg-[#FAF6EE] text-[#2C241B]',
    light: 'bg-[#FCFAF7] text-[#191919]',
    dark: 'bg-[#121214] text-[#E8E6E1]'
  }[theme];

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200 ${themeClasses}`}>
      {/* Sticky Reader Header */}
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 backdrop-blur-md bg-inherit/90">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#FF5924]/15 text-[#FF5924] flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider opacity-70">
              Reader Mode · {card.domain || 'Article'}
            </span>
          </div>
        </div>

        {/* Reader Controls: Font Size, Theme, Close */}
        <div className="flex items-center gap-2">
          {/* Font Size Toggles */}
          <div className="flex items-center rounded-full bg-black/5 dark:bg-white/5 p-0.5">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 text-xs rounded-full font-editorial ${fontSize === 'normal' ? 'bg-white dark:bg-white/20 shadow-xs text-[#191919] dark:text-white' : 'opacity-60'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 text-sm rounded-full font-editorial ${fontSize === 'large' ? 'bg-white dark:bg-white/20 shadow-xs text-[#191919] dark:text-white' : 'opacity-60'}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-2.5 py-1 text-base rounded-full font-editorial ${fontSize === 'huge' ? 'bg-white dark:bg-white/20 shadow-xs text-[#191919] dark:text-white' : 'opacity-60'}`}
            >
              A++
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center rounded-full bg-black/5 dark:bg-white/5 p-0.5">
            <button
              onClick={() => setTheme('sepia')}
              title="Warm Sepia Linen"
              className={`p-1.5 rounded-full ${theme === 'sepia' ? 'bg-[#F4EBD9] text-[#78512E] shadow-xs' : 'opacity-60'}`}
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              title="Clean Linen"
              className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-white text-black shadow-xs' : 'opacity-60'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Obsidian Dark"
              className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-[#27272A] text-white shadow-xs' : 'opacity-60'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Original Page"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={onClose}
            title="Exit Reading Mode (Esc)"
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Reading Column */}
      <article className="max-w-[680px] mx-auto px-6 py-12 md:py-16">
        {/* Article Metadata */}
        <div className="space-y-3 mb-8 pb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3 text-xs font-mono opacity-70">
            {card.author && <span>By {card.author}</span>}
            {card.publishedAt && <span>· {card.publishedAt}</span>}
            {card.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                · <Clock className="w-3 h-3" /> {card.readingTimeMinutes} min read
              </span>
            )}
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15]">
            {card.title}
          </h1>

          {card.excerpt && (
            <p className="font-editorial-italic text-lg opacity-85 leading-relaxed pt-1">
              {card.excerpt}
            </p>
          )}
        </div>

        {/* Cover Photo */}
        {card.thumbnailUrl && (
          <div className="my-8 rounded-2xl overflow-hidden shadow-md">
            <img
              src={card.thumbnailUrl}
              alt={card.title}
              className="w-full h-auto object-cover max-h-[460px]"
            />
          </div>
        )}

        {/* Body Text */}
        <div className={`font-editorial ${fontClasses} whitespace-pre-wrap space-y-6 pt-2`}>
          {card.content}
        </div>

        {/* Permanent Archive Notice */}
        <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-mono opacity-60">
          <span>Saved to your private mind</span>
          <span>Permanent offline backup active</span>
        </div>
      </article>
    </div>
  );
};
