import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './types/card';
import { Workspace } from './types/workspace';
import { ChainedTokenPill } from './types/search';
import { db } from './core/db';
import { INITIAL_CARDS, INITIAL_SPACES } from './data/mockSeedData';
import { SearchEngine } from './engine/search';
import { VectorEngine } from './engine/ai/vectorEngine';

// Components
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { TopOfMind } from './components/TopOfMind';
import { SpacesBar, SpaceItem } from './components/SpacesBar';
import { DeckGrid } from './components/DeckGrid';
import { CardDetailModal } from './components/CardDetailModal';
import { ReadingModeModal } from './components/ReadingModeModal';
import { SerendipityModal } from './components/SerendipityModal';
import { WhyTagPopover } from './components/WhyTagPopover';
import { AskLibraryDrawer } from './components/AskLibraryDrawer';
import { MoodboardCanvas } from './components/MoodboardCanvas';
import { QuickSaveModal } from './components/QuickSaveModal';
import { MobileBottomDock } from './components/MobileBottomDock';

const WORKSPACES: Workspace[] = [
  {
    id: 'ws-personal',
    name: 'My Personal Hivemind',
    slug: 'personal',
    isPersonal: true,
    memberCount: 1,
    currentUserRole: 'owner',
    createdAt: Date.now()
  },
  {
    id: 'ws-team',
    name: 'Atelier Design Studio (Team)',
    slug: 'atelier',
    isPersonal: false,
    memberCount: 3,
    currentUserRole: 'owner',
    createdAt: Date.now()
  }
];

export function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (localStorage.getItem('hivemind-theme') || localStorage.getItem('mymind-theme')) === 'dark';
  });

  // Data state
  const [cards, setCards] = useState<Card[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(WORKSPACES[0]);
  const [spaces, setSpaces] = useState<SpaceItem[]>(INITIAL_SPACES);
  const [activeSpaceId, setActiveSpaceId] = useState<string>('space-all');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPills, setSearchPills] = useState<ChainedTokenPill[]>([]);
  const [isGridFaded, setIsGridFaded] = useState(false);

  // Modals & Panels state
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [readingModeCard, setReadingModeCard] = useState<Card | null>(null);
  const [whyTagCard, setWhyTagCard] = useState<Card | null>(null);
  const [isQuickSaveOpen, setIsQuickSaveOpen] = useState(false);
  const [isSerendipityOpen, setIsSerendipityOpen] = useState(false);
  const [isAskLibraryOpen, setIsAskLibraryOpen] = useState(false);
  const [isCanvasActive, setIsCanvasActive] = useState(false);

  // Initialize and Seed Dexie IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const count = await db.cards.count();
        if (count === 0) {
          // Pre-compute embeddings for initial seed
          const seeded = INITIAL_CARDS.map(card => ({
            ...card,
            embedding: VectorEngine.embedCard(card) as any
          }));
          await db.cards.bulkAdd(seeded);
          setCards(seeded);
        } else {
          const loaded = await db.cards.filter(c => !c.isDeleted).toArray();
          setCards(loaded);
        }
      } catch (err) {
        console.warn('Dexie DB fallback to in-memory state:', err);
        setCards(INITIAL_CARDS);
      }
    };
    initDB();
  }, []);

  // Update HTML root theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hivemind-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hivemind-theme', 'light');
    }
  }, [darkMode]);

  // Card Mutators with IndexedDB persistence
  const handleSaveNewCard = async (newCard: Card) => {
    const embeddedCard = {
      ...newCard,
      embedding: VectorEngine.embedCard(newCard) as any
    };
    setCards(prev => [embeddedCard, ...prev]);
    try {
      await db.cards.add(embeddedCard);
    } catch (e) {
      console.warn('DB sync error:', e);
    }
  };

  const handleUpdateCard = async (updated: Card) => {
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedCard?.id === updated.id) setSelectedCard(updated);
    try {
      await db.cards.put(updated);
    } catch (e) {
      console.warn('DB sync error:', e);
    }
  };

  const handleDeleteCard = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCards(prev => prev.filter(c => c.id !== id));
    if (selectedCard?.id === id) setSelectedCard(null);
    try {
      await db.cards.delete(id);
    } catch (e) {
      console.warn('DB sync error:', e);
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = cards.find(c => c.id === id);
    if (!target) return;
    const updated = { ...target, isFavorite: !target.isFavorite };
    handleUpdateCard(updated);
  };

  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = cards.find(c => c.id === id);
    if (!target) return;
    const updated = { ...target, isPinned: !target.isPinned };
    handleUpdateCard(updated);
  };

  const handleToggleTodoItem = async (cardId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const card = cards.find(c => c.id === cardId);
    if (!card || !card.metadata?.todo) return;

    const items = card.metadata.todo.items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const completedCount = items.filter(i => i.completed).length;
    const progressPercent = Math.round((completedCount / items.length) * 100);

    const updated = {
      ...card,
      metadata: {
        ...card.metadata,
        todo: {
          items,
          progressPercent
        }
      }
    };
    handleUpdateCard(updated);
  };

  // Tag Management with AI Reasoning
  const handleRemoveTag = (cardId: string, tagId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const updated = {
      ...card,
      tags: card.tags.filter(t => t.id !== tagId)
    };
    handleUpdateCard(updated);
    if (whyTagCard?.id === cardId) setWhyTagCard(updated);
  };

  const handleAddTag = (cardId: string, tagName: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const clean = tagName.trim().replace(/^#/, '');
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
    handleUpdateCard(updated);
    if (whyTagCard?.id === cardId) setWhyTagCard(updated);
  };

  // Same Vibe Trigger
  const handleOpenSameVibe = (targetCard: Card, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const resonantCards = VectorEngine.findSameVibe(targetCard, cards, 6);
    // Add Vibe search pill
    setSearchPills([
      {
        id: `vibe-${Date.now()}`,
        label: `|| vibe: "${targetCard.title.slice(0, 24)}..."`,
        value: targetCard.title,
        field: 'vibe'
      }
    ]);
    setSearchQuery('');
  };

  // Mind Link Navigation
  const handleNavigateMindLink = (targetTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = cards.find(c => c.title.toLowerCase().includes(targetTitle.toLowerCase()));
    if (target) {
      setSelectedCard(target);
    } else {
      setSearchQuery(`"${targetTitle}"`);
    }
  };

  // Clear Your Hivemind (Archive stale unpinned cards)
  const handleClearYourMind = () => {
    if (window.confirm("Clear Your Hivemind will review older memories. Would you like to enter Serendipity mode to review them?")) {
      setIsSerendipityOpen(true);
    }
  };

  // Export Hivemind data to JSON & CSV
  const handleExportMind = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hivemind-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter cards by active workspace
  const workspaceCards = useMemo(() => {
    return cards.filter(c => !c.workspaceId || c.workspaceId === activeWorkspace.id);
  }, [cards, activeWorkspace]);

  // Space filtering
  const spaceFilteredCards = useMemo(() => {
    if (activeSpaceId === 'space-all') return workspaceCards;

    const activeSpace = spaces.find(s => s.id === activeSpaceId);
    if (!activeSpace) return workspaceCards;

    if (activeSpace.isSmart && activeSpace.filterQuery) {
      // Execute query parser for smart space
      const result = SearchEngine.execute(workspaceCards, activeSpace.filterQuery, []);
      return result.matchingCards;
    }

    return workspaceCards.filter(c => c.spaceIds?.includes(activeSpaceId));
  }, [workspaceCards, activeSpaceId, spaces]);

  // Execute Search Engine with chained pills and operators
  const searchResults = useMemo(() => {
    return SearchEngine.execute(spaceFilteredCards, searchQuery, searchPills);
  }, [spaceFilteredCards, searchQuery, searchPills]);

  // Pinned priorities for "Top of Mind"
  const pinnedCards = useMemo(() => {
    return workspaceCards.filter(c => c.isPinned && !c.isDeleted && !c.isArchived);
  }, [workspaceCards]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] dark:bg-[#121213] text-[#191919] dark:text-[#fbfaf8] transition-colors duration-200">
      {/* 1. Header with workspace selector, stats & action modes */}
      <Header
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onOpenQuickSave={() => setIsQuickSaveOpen(true)}
        onOpenSerendipity={() => setIsSerendipityOpen(true)}
        onOpenAskLibrary={() => setIsAskLibraryOpen(true)}
        onToggleCanvas={() => setIsCanvasActive(!isCanvasActive)}
        isCanvasActive={isCanvasActive}
        onClearYourMind={handleClearYourMind}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        cardCount={workspaceCards.length}
        onExport={handleExportMind}
      />

      {/* 2. Floating Frosted Glass Search Bar with Deep Chaining */}
      <SearchBar
        query={searchQuery}
        onChangeQuery={setSearchQuery}
        pills={searchPills}
        onAddPill={(pill) => setSearchPills(prev => [...prev, pill])}
        onRemovePill={(id) => setSearchPills(prev => prev.filter(p => p.id !== id))}
        onClearAll={() => {
          setSearchQuery('');
          setSearchPills([]);
        }}
        isGridFaded={isGridFaded}
        onSetGridFaded={setIsGridFaded}
      />

      {/* 3. Top of Mind Pinned Priority Tray */}
      {!searchQuery && searchPills.length === 0 && (
        <TopOfMind
          pinnedCards={pinnedCards}
          onSelectCard={(c) => setSelectedCard(c)}
          onUnpinCard={handleTogglePin}
        />
      )}

      {/* 4. Spaces & Smart Spaces Bar */}
      <SpacesBar
        spaces={spaces.map(s => ({
          ...s,
          count: s.id === 'space-all' ? workspaceCards.length : undefined
        }))}
        activeSpaceId={activeSpaceId}
        onSelectSpace={(s) => setActiveSpaceId(s.id)}
        onCreateSpace={() => {
          const name = prompt("Name for your new Space:");
          if (name) {
            const newSpace: SpaceItem = {
              id: `space-${Date.now()}`,
              name,
              slug: name.toLowerCase().replace(/\s+/g, '-'),
              color: '#d45b3a',
              isSmart: false
            };
            setSpaces(prev => [...prev, newSpace]);
            setActiveSpaceId(newSpace.id);
          }
        }}
      />

      {/* 5. Main Canvas / Masonry Deck View */}
      {isCanvasActive ? (
        <MoodboardCanvas
          cards={searchResults.matchingCards}
          onSelectCard={(c) => setSelectedCard(c)}
          onCloseCanvas={() => setIsCanvasActive(false)}
        />
      ) : (
        <DeckGrid
          cards={searchResults.matchingCards}
          isGridFaded={isGridFaded}
          onSelectCard={(c) => setSelectedCard(c)}
          onToggleFavorite={handleToggleFavorite}
          onTogglePin={handleTogglePin}
          onDeleteCard={handleDeleteCard}
          onOpenSameVibe={handleOpenSameVibe}
          onOpenReadingMode={(c) => setReadingModeCard(c)}
          onOpenWhyTag={(c) => setWhyTagCard(c)}
          onToggleTodoItem={handleToggleTodoItem}
          onNavigateMindLink={handleNavigateMindLink}
          onOpenQuickSave={() => setIsQuickSaveOpen(true)}
        />
      )}

      {/* Modals & Drawers */}
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onOpenReadingMode={(c) => {
          setSelectedCard(null);
          setReadingModeCard(c);
        }}
        onOpenWhyTag={(c) => setWhyTagCard(c)}
        onOpenSameVibe={handleOpenSameVibe}
        allCards={workspaceCards}
        onSelectCard={(c) => setSelectedCard(c)}
      />

      <ReadingModeModal
        card={readingModeCard}
        onClose={() => setReadingModeCard(null)}
      />

      <WhyTagPopover
        card={whyTagCard}
        onClose={() => setWhyTagCard(null)}
        onRemoveTag={handleRemoveTag}
        onAddTag={handleAddTag}
      />

      <SerendipityModal
        cards={workspaceCards}
        isOpen={isSerendipityOpen}
        onClose={() => setIsSerendipityOpen(false)}
        onKeepCard={(c) => handleToggleFavorite(c.id, {} as any)}
        onArchiveCard={(c) => handleDeleteCard(c.id)}
      />

      <AskLibraryDrawer
        cards={workspaceCards}
        isOpen={isAskLibraryOpen}
        onClose={() => setIsAskLibraryOpen(false)}
        onSelectCard={(c) => setSelectedCard(c)}
      />

      <QuickSaveModal
        isOpen={isQuickSaveOpen}
        onClose={() => setIsQuickSaveOpen(false)}
        onSaveCard={handleSaveNewCard}
        activeWorkspaceId={activeWorkspace.id}
      />

      {/* Touch-Friendly Mobile Floating Bottom Dock */}
      <MobileBottomDock
        onOpenQuickSave={() => setIsQuickSaveOpen(true)}
        onOpenSerendipity={() => setIsSerendipityOpen(true)}
        onOpenAskLibrary={() => setIsAskLibraryOpen(true)}
        onFocusSearch={() => {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
          searchInput?.focus();
        }}
        isCanvasActive={isCanvasActive}
        onToggleCanvas={() => setIsCanvasActive(!isCanvasActive)}
      />
    </div>
  );
}

export default App;
