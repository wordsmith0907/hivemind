import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  LayoutGrid, 
  Plus, 
  Moon, 
  Sun, 
  Users, 
  Layers, 
  Check, 
  ChevronDown,
  Trash2,
  HardDriveDownload
} from 'lucide-react';
import { Workspace } from '../types/workspace';
import { BrandMonogram } from './BrandMonogram';

interface HeaderProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  onOpenQuickSave: () => void;
  onOpenSerendipity: () => void;
  onOpenAskLibrary: () => void;
  onToggleCanvas: () => void;
  isCanvasActive: boolean;
  onClearYourMind: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  cardCount: number;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onOpenQuickSave,
  onOpenSerendipity,
  onOpenAskLibrary,
  onToggleCanvas,
  isCanvasActive,
  onClearYourMind,
  darkMode,
  onToggleDarkMode,
  cardCount,
  onExport
}) => {
  const [showWsMenu, setShowWsMenu] = useState(false);

  return (
    <header className="w-full pt-5 pb-3 px-6 md:px-12 flex items-center justify-between z-30 transition-all duration-200">
      {/* Brand & Workspace Selector */}
      <div className="flex items-center gap-3.5">
        {/* Brand Monogram */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="mymind — Remember everything. Organize nothing."
        >
          <BrandMonogram />
        </div>

        {/* Workspace Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWsMenu(!showWsMenu)}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-full bg-[#F0EAE1]/60 dark:bg-[#252528] text-[#55524D] dark:text-[#A09E99] hover:bg-[#E6DFD4] dark:hover:bg-[#2E2E33] transition-colors"
          >
            {activeWorkspace.isPersonal ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5924]" />
            ) : (
              <Users className="w-3 h-3 text-[#2463EB]" />
            )}
            <span>{activeWorkspace.name}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </button>

          {showWsMenu && (
            <div className="absolute left-0 mt-2 w-56 py-1.5 bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-xl border border-[rgba(0,0,0,0.06)] dark:border-[#2E2E33] z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1 text-[10px] font-semibold text-[#8A8782] uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    setShowWsMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-[#F8F6F2] dark:hover:bg-[#28282C] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {ws.isPersonal ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5924]" />
                    ) : (
                      <Users className="w-3.5 h-3.5 text-[#2463EB]" />
                    )}
                    <span className="font-medium text-[#191919] dark:text-[#F0F0EE]">{ws.name}</span>
                  </div>
                  {ws.id === activeWorkspace.id && <Check className="w-3.5 h-3.5 text-[#FF5924]" />}
                </button>
              ))}

              <div className="my-1 border-t border-[rgba(0,0,0,0.06)] dark:border-[#2E2E33]" />
              <button
                onClick={() => {
                  onExport();
                  setShowWsMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs text-[#55524D] dark:text-[#A09E99] hover:bg-[#F8F6F2] dark:hover:bg-[#28282C] flex items-center gap-2"
              >
                <HardDriveDownload className="w-3.5 h-3.5 text-[#706E6B]" />
                <span>Export Mind (JSON & CSV)</span>
              </button>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center text-[11px] text-[#9C9994] dark:text-[#6E6C68] font-mono ml-0.5">
          <span>{cardCount} memories</span>
        </div>
      </div>

      {/* Action Tools & Modes */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Serendipity Resurfacing */}
        <button
          onClick={onOpenSerendipity}
          title="Serendipity: Zen Memory Resurfacing"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full text-[#55524D] dark:text-[#C4C2BE] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#252528] transition-all duration-200"
        >
          <Compass className="w-3.5 h-3.5 text-[#FF5924]" />
          <span className="hidden md:inline">Serendipity</span>
        </button>

        {/* Ask Your Library (AI Grounded Search) */}
        <button
          onClick={onOpenAskLibrary}
          title="Ask Your Library (AI Grounded RAG)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full text-[#55524D] dark:text-[#C4C2BE] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#252528] transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFE926]" />
          <span className="hidden md:inline">Ask Mind</span>
        </button>

        {/* Freeform Moodboard Canvas */}
        <button
          onClick={onToggleCanvas}
          title={isCanvasActive ? 'Switch to Grid View' : 'Switch to Spatial Moodboard Canvas'}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
            isCanvasActive
              ? 'bg-[#191919] text-white dark:bg-[#FCFAF7] dark:text-[#191919] shadow-sm'
              : 'text-[#55524D] dark:text-[#C4C2BE] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#252528]'
          }`}
        >
          {isCanvasActive ? <LayoutGrid className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isCanvasActive ? 'Grid' : 'Canvas'}</span>
        </button>

        {/* Clear Your Mind */}
        <button
          onClick={onClearYourMind}
          title="Clear Your Mind: Review & Archive Stale Cards"
          className="p-2 text-[#706E6B] dark:text-[#8F8D88] hover:text-[#FF5924] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#252528] rounded-full transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Warm Parchment Mode' : 'Switch to Obsidian Dark Mode'}
          className="p-2 text-[#706E6B] dark:text-[#8F8D88] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#252528] rounded-full transition-colors"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-[#FFE926]" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Primary Save Button */}
        <button
          onClick={onOpenQuickSave}
          className="flex items-center gap-1.5 ml-1 px-4 py-2 bg-[#191919] hover:bg-[#2E2E2E] dark:bg-[#FCFAF7] dark:hover:bg-[#E8E6E1] text-white dark:text-[#191919] text-xs font-semibold rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Remember</span>
        </button>
      </div>
    </header>
  );
};
