import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Pin, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  ExternalLink, 
  Tag as TagIcon, 
  MessageSquare, 
  Clock, 
  Link2,
  Check,
  Send,
  Plus
} from 'lucide-react';
import { Card } from '../types/card';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
  onUpdateCard: (updated: Card) => void;
  onDeleteCard: (id: string) => void;
  onOpenReadingMode: (card: Card) => void;
  onOpenWhyTag: (card: Card) => void;
  onOpenSameVibe: (card: Card) => void;
  allCards: Card[];
  onSelectCard: (card: Card) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onUpdateCard,
  onDeleteCard,
  onOpenReadingMode,
  onOpenWhyTag,
  onOpenSameVibe,
  allCards,
  onSelectCard
}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: 'c1', user: 'You', text: 'Saved this memory for creative inspiration and references.', time: '2 hours ago' }
  ]);
  const [newTag, setNewTag] = useState('');

  // Close on Escape
  useEffect(() => {
    if (!card) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onClose]);

  if (!card) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([
        ...comments,
        { id: `cmt-${Date.now()}`, user: 'You', text: commentText.trim(), time: 'Just now' }
      ]);
      setCommentText('');
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      const clean = newTag.trim().replace(/^#/, '');
      const updated = {
        ...card,
        tags: [
          ...card.tags,
          {
            id: `tag-${Date.now()}`,
            name: clean,
            confidence: 1.0,
            source: 'user' as const,
            reason: 'Added manually by user'
          }
        ]
      };
      onUpdateCard(updated);
      setNewTag('');
    }
  };

  // Find linked cards
  const linkedCards = allCards.filter(c => card.mindLinks?.includes(c.id));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/45 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#1C1C1F] rounded-[28px] shadow-2xl border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Header */}
        <div className="p-4 px-6 border-b border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-[#FF5924] px-2.5 py-0.5 rounded-full bg-[#FF5924]/10">
              {card.type}
            </span>
            {card.domain && (
              <span className="text-xs text-[#748297] dark:text-[#A3A19D] font-body">
                {card.domain}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Same Vibe */}
            <button
              onClick={() => onOpenSameVibe(card)}
              title="Find Same Vibe"
              className="p-2 text-[#748297] hover:text-[#FF5924] rounded-full hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Reading Mode */}
            {card.type === 'article' && (
              <button
                onClick={() => onOpenReadingMode(card)}
                title="Reading Mode"
                className="p-2 text-[#748297] hover:text-[#FF5924] rounded-full hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}

            {/* Why this tag */}
            <button
              onClick={() => onOpenWhyTag(card)}
              title="Why this tag?"
              className="p-2 text-[#748297] hover:text-[#FFE926] rounded-full hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C] transition-colors"
            >
              <TagIcon className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                onDeleteCard(card.id);
                onClose();
              }}
              title="Delete Card"
              className="p-2 text-[#748297] hover:text-[#E11D48] rounded-full hover:bg-[#FEE2E2] dark:hover:bg-[#38151C] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-[rgba(0,0,0,0.06)] dark:bg-[#2D2D31] mx-1" />

            <button
              onClick={onClose}
              className="p-1.5 text-[#9C9994] hover:text-[#191919] dark:hover:text-[#F5F4F2] rounded-full hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cover Media if any */}
          {card.thumbnailUrl && (
            <div className="w-full rounded-2xl overflow-hidden bg-[#EEE9DF] max-h-80">
              <img
                src={card.thumbnailUrl}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="font-editorial text-2xl md:text-3xl font-medium text-[#191919] dark:text-[#F5F4F2] leading-tight">
              {card.title}
            </h1>
            {card.excerpt && (
              <p className="mt-2 text-sm text-[#748297] dark:text-[#A3A19D] font-body leading-relaxed">
                {card.excerpt}
              </p>
            )}
          </div>

          {/* Content Body */}
          <div className="p-4 rounded-2xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.05)] dark:border-[#28282C] text-sm text-[#33312E] dark:text-[#D4CEBD] font-body whitespace-pre-wrap leading-relaxed">
            {card.content}
          </div>

          {/* Color Palette Ribbon */}
          {card.colorPalette?.hexPalette && (
            <div>
              <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-[#9C9994] dark:text-[#6E6C68] block mb-2">
                Color Resonance Palette
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {card.colorPalette.hexPalette.map((hex, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.05)] dark:border-[#28282C]">
                    <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                    <span className="text-[11px] font-mono text-[#55524D] dark:text-[#A3A19D]">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-[#9C9994] dark:text-[#6E6C68]">
                Tags ({card.tags.length})
              </span>
              <button
                onClick={() => onOpenWhyTag(card)}
                className="text-xs text-[#FF5924] hover:underline flex items-center gap-1 font-body-medium"
              >
                <span>Why these tags?</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#F0EAE1]/60 dark:bg-[#252528] text-[#55524D] dark:text-[#A3A19D] font-body"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Mind Links Graph ([[Card]] References) */}
          {linkedCards.length > 0 && (
            <div>
              <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-[#9C9994] dark:text-[#6E6C68] block mb-2">
                Mind Links & Cross-References ({linkedCards.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {linkedCards.map((lc) => (
                  <button
                    key={lc.id}
                    onClick={() => onSelectCard(lc)}
                    className="p-3 rounded-xl bg-white dark:bg-[#18181B] border border-[rgba(0,0,0,0.06)] dark:border-[#2E2E33] hover:border-[#FF5924] text-left transition-colors flex items-center gap-2 group"
                  >
                    <Link2 className="w-4 h-4 text-[#FF5924]" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-mono font-semibold text-[#9C9994] block">{lc.type}</span>
                      <span className="font-editorial text-xs font-medium text-[#191919] dark:text-[#F5F4F2] truncate block group-hover:text-[#FF5924]">
                        {lc.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collaborative Comments (Next-Gen Team Feature) */}
          <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31]">
            <span className="text-[11px] uppercase font-mono font-semibold tracking-wider text-[#9C9994] dark:text-[#6E6C68] block mb-3">
              Studio Notes & Collaborator Insights
            </span>
            <div className="space-y-2 mb-3">
              {comments.map((cmt) => (
                <div key={cmt.id} className="p-3 rounded-xl bg-[#FCFAF7] dark:bg-[#151517] text-xs font-body">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#191919] dark:text-[#F5F4F2]">{cmt.user}</span>
                    <span className="text-[10px] text-[#9C9994] font-mono">{cmt.time}</span>
                  </div>
                  <p className="text-[#55524D] dark:text-[#A3A19D] leading-relaxed">{cmt.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave an insight or studio note..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#191919] dark:bg-[#FCFAF7] text-white dark:text-[#191919] rounded-xl text-xs font-btn shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
