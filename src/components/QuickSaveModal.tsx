import React, { useState, useEffect } from 'react';
import { X, Link2, FileText, Quote, CheckSquare, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import { Card, CardType } from '../types/card';
import { TypeClassifier } from '../engine/ai/typeClassifier';
import { ReasoningTagger } from '../engine/ai/reasoningTagger';
import { ColorExtractor } from '../engine/ai/colorExtractor';

interface QuickSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCard: (card: Card) => void;
  activeWorkspaceId: string;
}

export const QuickSaveModal: React.FC<QuickSaveModalProps> = ({
  isOpen,
  onClose,
  onSaveCard,
  activeWorkspaceId
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'note' | 'quote' | 'todo' | 'image'>('link');
  
  // Link Tab state
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [thumbnailInput, setThumbnailInput] = useState('');

  // Note/Quote/Todo state
  const [authorInput, setAuthorInput] = useState('');

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let cardType: CardType = 'note';
    let title = titleInput.trim();
    let content = contentInput.trim();
    let domain: string | undefined = undefined;

    if (activeTab === 'link') {
      const url = urlInput.trim();
      if (!url) return;
      try {
        const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        domain = parsedUrl.hostname.replace(/^www\./, '');
      } catch {
        domain = 'web';
      }

      // Automatic Type Classification
      const classification = TypeClassifier.classify({
        url,
        title: title || domain,
        content: content || `Saved link from ${domain}`
      });

      cardType = classification.type;
      title = title || `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} from ${domain}`;
      content = content || `Saved from ${url}`;
    } else if (activeTab === 'quote') {
      cardType = 'quote';
      title = title || `Quote by ${authorInput.trim() || 'Unknown'}`;
    } else if (activeTab === 'todo') {
      cardType = 'todo';
      title = title || 'Checklist';
    } else if (activeTab === 'image') {
      cardType = 'image';
      title = title || 'Visual Memory';
    }

    // Default aesthetic color palette
    const palette = ColorExtractor.getDefaultPalette();

    // Generate reasoned tags
    const tags = ReasoningTagger.generateTags({
      title,
      content,
      type: cardType,
      url: activeTab === 'link' ? urlInput : undefined,
      domain,
      colorPalette: palette
    });

    const newCard: Card = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      workspaceId: activeWorkspaceId,
      type: cardType,
      title,
      content,
      excerpt: content.slice(0, 140),
      url: activeTab === 'link' ? urlInput : undefined,
      domain,
      author: authorInput.trim() || undefined,
      thumbnailUrl: thumbnailInput.trim() || (activeTab === 'image' ? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80' : undefined),
      colorPalette: palette,
      tags,
      spaceIds: ['space-all'],
      mindLinks: [],
      isFavorite: false,
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: activeTab === 'quote' ? {
        quote: {
          author: authorInput.trim() || 'Unknown'
        }
      } : activeTab === 'todo' ? {
        todo: {
          items: content.split('\n').filter(Boolean).map((line, idx) => ({
            id: `item-${idx}`,
            text: line.replace(/^-\s*(\[[ x]\]\s*)?/, ''),
            completed: false
          })),
          progressPercent: 0
        }
      } : undefined
    };

    onSaveCard(newCard);
    onClose();

    // Reset inputs
    setUrlInput('');
    setTitleInput('');
    setContentInput('');
    setThumbnailInput('');
    setAuthorInput('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#1C1C1F] rounded-[28px] shadow-2xl border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Type Tabs */}
        <div className="p-4 px-6 border-b border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#FCFAF7] dark:bg-[#202024]">
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-btn transition-all ${
                activeTab === 'link' ? 'bg-white dark:bg-[#2E2E33] text-[#191919] dark:text-[#F5F4F2] shadow-xs' : 'text-[#748297] dark:text-[#A3A19D]'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Link</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('note')}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-btn transition-all ${
                activeTab === 'note' ? 'bg-white dark:bg-[#2E2E33] text-[#191919] dark:text-[#F5F4F2] shadow-xs' : 'text-[#748297] dark:text-[#A3A19D]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Note</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quote')}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-btn transition-all ${
                activeTab === 'quote' ? 'bg-white dark:bg-[#2E2E33] text-[#191919] dark:text-[#F5F4F2] shadow-xs' : 'text-[#748297] dark:text-[#A3A19D]'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Quote</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('todo')}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-btn transition-all ${
                activeTab === 'todo' ? 'bg-white dark:bg-[#2E2E33] text-[#191919] dark:text-[#F5F4F2] shadow-xs' : 'text-[#748297] dark:text-[#A3A19D]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Todo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-btn transition-all ${
                activeTab === 'image' ? 'bg-white dark:bg-[#2E2E33] text-[#191919] dark:text-[#F5F4F2] shadow-xs' : 'text-[#748297] dark:text-[#A3A19D]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#9C9994] hover:text-[#191919] dark:hover:text-[#F5F4F2] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {activeTab === 'link' && (
            <div>
              <label className="text-[11px] font-mono uppercase font-semibold text-[#9C9994] block mb-1.5">
                URL / Website Address
              </label>
              <input
                type="text"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://nytimes.com/... or https://hay.dk/products/..."
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono uppercase font-semibold text-[#9C9994] block mb-1.5">
              Title (Optional)
            </label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Leave blank for automatic AI title generation"
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-editorial"
            />
          </div>

          {activeTab === 'quote' && (
            <div>
              <label className="text-[11px] font-mono uppercase font-semibold text-[#9C9994] block mb-1.5">
                Quote Author / Attribution
              </label>
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="e.g. Marcus Aurelius or Dieter Rams"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body"
              />
            </div>
          )}

          {(activeTab === 'image' || activeTab === 'link') && (
            <div>
              <label className="text-[11px] font-mono uppercase font-semibold text-[#9C9994] block mb-1.5">
                Thumbnail Image URL (Optional)
              </label>
              <input
                type="text"
                value={thumbnailInput}
                onChange={(e) => setThumbnailInput(e.target.value)}
                placeholder="https://images.unsplash.com/... (extracts palette automatically)"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono uppercase font-semibold text-[#9C9994] block mb-1.5">
              {activeTab === 'quote' ? 'Quotation Text' : activeTab === 'todo' ? 'Checklist items (one per line)' : 'Notes or Excerpt'}
            </label>
            <textarea
              rows={4}
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder={
                activeTab === 'quote'
                  ? 'Simplicity is about subtracting the obvious and adding the meaningful.'
                  : activeTab === 'todo'
                  ? '- Design system tokens\n- Test vector similarity\n- Review reading mode'
                  : 'Write markdown notes, or type [[Card Name]] to create bidirectional Mind Links...'
              }
              className="w-full px-4 py-3 text-xs rounded-xl bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#9C9994] flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE926]" />
              <span>AI auto-tags & palette generated on save</span>
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#191919] hover:bg-[#2E2E2E] dark:bg-[#FCFAF7] dark:hover:bg-[#E8E6E1] text-white dark:text-[#191919] text-xs font-btn shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Remember</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
