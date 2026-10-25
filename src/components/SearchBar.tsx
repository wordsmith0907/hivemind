import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Hash, 
  Palette, 
  Globe, 
  BookOpen, 
  Quote, 
  ShoppingBag, 
  CheckSquare, 
  Image as ImageIcon 
} from 'lucide-react';
import { ChainedTokenPill } from '../types/search';

interface SearchBarProps {
  query: string;
  onChangeQuery: (q: string) => void;
  pills: ChainedTokenPill[];
  onAddPill: (pill: ChainedTokenPill) => void;
  onRemovePill: (id: string) => void;
  onClearAll: () => void;
  isGridFaded: boolean;
  onSetGridFaded: (faded: boolean) => void;
  activeTypeFilter?: string;
  onSelectTypeFilter?: (type: string | undefined) => void;
}

const OPERATOR_SUGGESTIONS = [
  { prefix: 'type:article', label: 'Articles', icon: BookOpen, desc: 'Long-form reads & essays' },
  { prefix: 'type:quote', label: 'Quotes', icon: Quote, desc: 'Words of wisdom & excerpts' },
  { prefix: 'type:product', label: 'Products', icon: ShoppingBag, desc: 'Items, wishlist & prices' },
  { prefix: 'type:image', label: 'Images', icon: ImageIcon, desc: 'Visual photography & scans' },
  { prefix: 'type:todo', label: 'Todos', icon: CheckSquare, desc: 'Checklists & active tasks' },
  { prefix: 'color:terracotta', label: 'Color: Terracotta', icon: Palette, desc: 'Search by extracted visual hue' },
  { prefix: 'color:warm ochre', label: 'Color: Warm Ochre', icon: Palette, desc: 'Search by extracted visual hue' },
  { prefix: 'color:sage green', label: 'Color: Sage Green', icon: Palette, desc: 'Search by extracted visual hue' },
  { prefix: '|| ', label: 'Semantic Vibe Search', icon: Sparkles, desc: 'Find concepts related to phrase' },
  { prefix: '#', label: 'Tag Search', icon: Hash, desc: 'Filter by specific #tag' },
  { prefix: 'site:nytimes.com', label: 'Site: NYTimes', icon: Globe, desc: 'Filter by publisher domain' }
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChangeQuery,
  pills,
  onAddPill,
  onRemovePill,
  onClearAll,
  onSetGridFaded
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        onAddPill({
          id: `pill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: trimmed,
          value: trimmed,
          field: trimmed.startsWith('#') ? 'tag' : trimmed.startsWith('||') ? 'vibe' : 'keyword'
        });
        onChangeQuery('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Backspace' && query === '' && pills.length > 0) {
      // Remove last pill on Backspace when input is empty
      onRemovePill(pills[pills.length - 1].id);
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (prefix: string) => {
    if (prefix.endsWith(' ')) {
      onChangeQuery(prefix);
      inputRef.current?.focus();
    } else {
      onAddPill({
        id: `pill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        label: prefix,
        value: prefix,
        field: prefix.startsWith('type:') ? 'type' : prefix.startsWith('color:') ? 'color' : 'keyword'
      });
      onChangeQuery('');
    }
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 relative z-40 my-3">
      {/* Floating Frosted Pill Bar */}
      <div 
        className={`w-full min-h-[50px] rounded-full transition-all duration-300 flex items-center px-4 py-2 ${
          isFocused 
            ? 'liquid-glass-focus scale-[1.01]' 
            : 'liquid-glass hover:shadow-lg'
        }`}
      >
        {/* The Signature Pulsating Orange Dot */}
        <div className="mr-3 ml-1 flex items-center justify-center flex-shrink-0">
          <span className="w-2.5 h-2.5 mymind-pulse-dot" />
        </div>

        {/* Chained Token Pills Container */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {pills.map((pill) => (
            <span
              key={pill.id}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium animate-in fade-in zoom-in-95 duration-150 ${
                pill.label.startsWith('type:') 
                  ? 'bg-[#191919] text-white dark:bg-[#fbfaf8] dark:text-[#191919]' 
                  : pill.label.startsWith('color:') 
                  ? 'bg-[#ffe926]/40 dark:bg-[#3d3600] text-[#715400] dark:text-[#ffe926]'
                  : pill.label.startsWith('||')
                  ? 'bg-[#ff7dd3]/30 dark:bg-[#3d0026] text-[#930058] dark:text-[#ff7dd3]'
                  : 'bg-[#f0eae1] dark:bg-[#2d2d31] text-[#33312e] dark:text-[#e4e2dd]'
              }`}
            >
              <span>{pill.label}</span>
              <button
                type="button"
                onClick={() => onRemovePill(pill.id)}
                className="hover:opacity-75 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Main Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              onChangeQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
              onSetGridFaded(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              onSetGridFaded(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={pills.length === 0 ? "Search your mind..." : "Add more terms..."}
            className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-[14px] text-[#191919] dark:text-[#f0f0ee] placeholder:text-[#9c9994] dark:placeholder:text-[#6e6c68] font-body tracking-tight"
          />
        </div>

        {/* Clear or Quick Hint */}
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          {(query || pills.length > 0) ? (
            <button
              onClick={() => {
                onChangeQuery('');
                onClearAll();
                inputRef.current?.focus();
              }}
              title="Clear Search"
              className="p-1 rounded-full text-[#9c9994] hover:text-[#191919] dark:hover:text-[#f0f0ee] hover:bg-[#f0eae1] dark:hover:bg-[#2a2a2d] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-[rgba(0,0,0,0.08)] dark:border-[#333336] text-[#9c9994] dark:text-[#666669]">
              /
            </span>
          )}
        </div>
      </div>

      {/* Autocomplete & Operator Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute left-4 right-4 mt-2 bg-white/95 dark:bg-[#1a1a1d]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[rgba(0,0,0,0.06)] dark:border-[#2e2e33] py-2 px-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-semibold text-[#8a8782] dark:text-[#6e6c68] uppercase tracking-wider flex items-center justify-between">
            <span>Filter Operators & Concepts</span>
            <span className="text-[10px] font-mono normal-case opacity-70">Press Enter to chain</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
            {OPERATOR_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(item.prefix);
                  }}
                  className="w-full px-3 py-2 text-left rounded-xl hover:bg-[#f8f6f2] dark:hover:bg-[#252528] flex items-center gap-2.5 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#f0eae1]/60 dark:bg-[#2c2c30] flex items-center justify-center text-[#706e6b] group-hover:text-[#FF5924] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-[#191919] dark:text-[#f0f0ee] font-mono truncate">
                      {item.prefix}
                    </span>
                    <span className="text-[11px] text-[#8a8782] dark:text-[#7e7c77] truncate">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
