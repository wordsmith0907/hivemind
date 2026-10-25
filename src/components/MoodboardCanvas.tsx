import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, Layers, Move } from 'lucide-react';
import { Card } from '../types/card';
import { CardItem } from './CardItem';

interface MoodboardCanvasProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onCloseCanvas: () => void;
}

export const MoodboardCanvas: React.FC<MoodboardCanvasProps> = ({
  cards,
  onSelectCard,
  onCloseCanvas
}) => {
  const [scale, setScale] = useState(0.85);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    // Generate organic scattered positions
    const initialPos: Record<string, { x: number; y: number }> = {};
    cards.forEach((card, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      initialPos[card.id] = {
        x: 100 + col * 380 + (Math.sin(idx) * 30),
        y: 80 + row * 440 + (Math.cos(idx) * 20)
      };
    });
    return initialPos;
  });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  const handleMouseDown = (cardId: string, e: React.MouseEvent) => {
    // Don't drag if clicking buttons inside card
    if ((e.target as HTMLElement).closest('button')) return;

    setDraggingId(cardId);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: positions[cardId]?.x || 0,
      startY: positions[cardId]?.y || 0
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !dragStartRef.current) return;
    const dx = (e.clientX - dragStartRef.current.mouseX) / scale;
    const dy = (e.clientY - dragStartRef.current.mouseY) / scale;

    setPositions((prev) => ({
      ...prev,
      [draggingId]: {
        x: Math.max(0, dragStartRef.current!.startX + dx),
        y: Math.max(0, dragStartRef.current!.startY + dy)
      }
    }));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    dragStartRef.current = null;
  };

  return (
    <div 
      className="fixed inset-0 z-40 bg-[#f7f5f0] dark:bg-[#111113] overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Floating Canvas Toolbar */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2 p-1.5 rounded-full bg-white/90 dark:bg-[#1c1c1f]/90 border border-[#eae6df] dark:border-[#2e2e33] shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#d45b3a]">
          <Layers className="w-3.5 h-3.5" />
          <span>Moodboard Canvas</span>
        </div>

        <div className="w-[1px] h-4 bg-[#eae6df] dark:bg-[#2e2e33]" />

        <button
          onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
          title="Zoom In"
          className="p-1.5 rounded-full hover:bg-[#eee9df] dark:hover:bg-[#28282c] text-[#706e6b] dark:text-[#a09e99]"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => setScale((s) => Math.max(0.4, s - 0.1))}
          title="Zoom Out"
          className="p-1.5 rounded-full hover:bg-[#eee9df] dark:hover:bg-[#28282c] text-[#706e6b] dark:text-[#a09e99]"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => setScale(0.85)}
          title="Reset View"
          className="p-1.5 rounded-full hover:bg-[#eee9df] dark:hover:bg-[#28282c] text-[#706e6b] dark:text-[#a09e99]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[#eae6df] dark:bg-[#2e2e33]" />

        <button
          onClick={onCloseCanvas}
          title="Exit Canvas to Grid"
          className="p-1.5 rounded-full hover:bg-[#fee2e2] text-[#e11d48]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Canvas Dot Pattern */}
      <div 
        className="w-full h-full relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '3000px',
          height: '2400px',
          backgroundImage: 'radial-gradient(circle, rgba(160, 150, 140, 0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      >
        {cards.map((card) => {
          const pos = positions[card.id] || { x: 100, y: 100 };
          return (
            <div
              key={card.id}
              onMouseDown={(e) => handleMouseDown(card.id, e)}
              className="absolute w-[320px] transition-shadow duration-200"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                cursor: draggingId === card.id ? 'grabbing' : 'grab',
                zIndex: draggingId === card.id ? 50 : 10
              }}
            >
              <div className="pointer-events-auto">
                <CardItem
                  card={card}
                  onSelect={onSelectCard}
                  onToggleFavorite={() => {}}
                  onTogglePin={() => {}}
                  onDelete={() => {}}
                  onOpenSameVibe={() => {}}
                  onOpenReadingMode={() => {}}
                  onOpenWhyTag={() => {}}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
