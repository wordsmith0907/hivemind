import React from 'react';
import { X, Sparkles, ShieldCheck, Eye, Trash2, Plus, Info } from 'lucide-react';
import { Card, CardTag } from '../types/card';

interface WhyTagPopoverProps {
  card: Card | null;
  onClose: () => void;
  onRemoveTag: (cardId: string, tagId: string) => void;
  onAddTag: (cardId: string, tagName: string) => void;
}

export const WhyTagPopover: React.FC<WhyTagPopoverProps> = ({
  card,
  onClose,
  onRemoveTag,
  onAddTag
}) => {
  const [newTagInput, setNewTagInput] = React.useState('');

  // Close on Escape
  React.useEffect(() => {
    if (!card) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onClose]);

  if (!card) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      onAddTag(card.id, newTagInput.trim());
      setNewTagInput('');
    }
  };

  const getSourceBadge = (source: CardTag['source']) => {
    switch (source) {
      case 'color_vision':
        return { label: 'Visual Color Engine', color: 'bg-[#fef3c7] text-[#b45309]' };
      case 'url_domain':
        return { label: 'Domain Metadata', color: 'bg-[#e0f2fe] text-[#0369a1]' };
      case 'meta_schema':
        return { label: 'Structural Schema', color: 'bg-[#f3e8ff] text-[#7e22ce]' };
      case 'text_nlp':
        return { label: 'Semantic NLP', color: 'bg-[#dcfce7] text-[#15803d]' };
      case 'ocr':
        return { label: 'Vision OCR', color: 'bg-[#ffedd5] text-[#c2410c]' };
      case 'user':
        return { label: 'Manual Tag', color: 'bg-[#f1f5f9] text-[#334155]' };
      default:
        return { label: 'AI Inferred', color: 'bg-[#eee9df] text-[#55524d]' };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#1C1C1F] rounded-[28px] shadow-2xl border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE926]/20 flex items-center justify-center text-[#9E7B00] dark:text-[#FFE926]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-medium text-[#191919] dark:text-[#F5F4F2]">
                Visible AI & Tag Reasoning
              </h3>
              <p className="text-xs text-[#748297] dark:text-[#A3A19D] font-body">
                Transparent breakdown of why each tag was assigned
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#9C9994] hover:text-[#191919] dark:hover:text-[#F5F4F2] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Title Context */}
        <div className="my-4 p-3 rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.05)] dark:border-[#26262A]">
          <span className="text-[10px] uppercase font-mono font-semibold text-[#9C9994] dark:text-[#6E6C68]">
            Target Memory
          </span>
          <p className="font-editorial text-sm font-medium text-[#191919] dark:text-[#F5F4F2] truncate mt-0.5">
            {card.title}
          </p>
        </div>

        {/* Tags List with Reasoning */}
        <div className="space-y-3">
          {card.tags.map((tag) => {
            const badge = getSourceBadge(tag.source);
            return (
              <div
                key={tag.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#1F1F22] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D32] hover:border-[#FF5924]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-body text-[#191919] dark:text-[#F5F4F2]">
                      #{tag.name}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-[#5CB13E]" title="AI Confidence Score">
                      {Math.round(tag.confidence * 100)}% confidence
                    </span>
                    <button
                      onClick={() => onRemoveTag(card.id, tag.id)}
                      title="Remove Tag"
                      className="p-1 text-[#9C9994] hover:text-[#E11D48] rounded-full hover:bg-[#FEE2E2] dark:hover:bg-[#38151C] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#55524D] dark:text-[#A3A19D] font-body leading-relaxed flex items-start gap-1.5 mt-1">
                  <Info className="w-3.5 h-3.5 text-[#FF5924] flex-shrink-0 mt-0.5" />
                  <span>{tag.reason || 'Automatically inferred from visual/textual patterns.'}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Add Manual Tag Form */}
        <form onSubmit={handleAdd} className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] flex gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            placeholder="Add a custom tag (e.g. #autumn-mood)..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#191919] hover:bg-[#2E2E2E] dark:bg-[#FCFAF7] dark:hover:bg-[#E8E6E1] text-white dark:text-[#191919] rounded-xl text-xs font-btn flex items-center gap-1 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>
    </div>
  );
};
