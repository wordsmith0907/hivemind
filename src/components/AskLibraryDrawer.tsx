import React, { useState } from 'react';
import { X, Sparkles, Send, ExternalLink } from 'lucide-react';
import { Card } from '../types/card';
import { VectorEngine } from '../engine/ai/vectorEngine';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citedCards?: Card[];
}

interface AskLibraryDrawerProps {
  cards: Card[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (card: Card) => void;
}

export const AskLibraryDrawer: React.FC<AskLibraryDrawerProps> = ({
  cards,
  isOpen,
  onClose,
  onSelectCard
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Hello! I am your Hivemind Assistant. Ask me anything about what you've saved—design principles, architecture notes, book ideas, quotes, or color resonance. I synthesize answers grounded strictly in your private library with citations.",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userQuery = inputText.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userQuery
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Run semantic similarity search against local cards
    setTimeout(() => {
      const relevantCards = VectorEngine.semanticSearch(userQuery, cards, 0.40).slice(0, 4);

      let answer = '';
      if (relevantCards.length === 0) {
        answer = `I scanned your library for "${userQuery}", but could not find any memories closely matching that topic. Try saving a note, bookmark or quote on this subject!`;
      } else {
        const titles = relevantCards.map(c => `"${c.title}"`).join(', ');
        const excerpts = relevantCards
          .map(c => `• From ${c.title}: ${c.excerpt || c.content.slice(0, 120)}...`)
          .join('\n');

        answer = `Based on your saved memories (${titles}), here is what I found:\n\n${excerpts}\n\nThese thoughts form a cohesive pattern in your hivemind around ${userQuery.toLowerCase()}.`;
      }

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: answer,
        citedCards: relevantCards
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#1C1C1F] shadow-2xl border-l border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] flex flex-col animate-in slide-in-from-right duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 px-6 border-b border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FFE926]/20 text-[#9E7B00] dark:text-[#FFE926] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-lg font-medium text-[#191919] dark:text-[#F5F4F2]">
              Ask Your Hivemind
            </h3>
            <span className="text-[11px] font-mono text-[#748297] dark:text-[#A3A19D]">
              Grounded in {cards.length} private cards
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-[#9C9994] hover:text-[#191919] dark:hover:text-[#F5F4F2] hover:bg-[#F0EAE1]/70 dark:hover:bg-[#28282C] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs font-body leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#191919] dark:bg-[#FCFAF7] text-white dark:text-[#191919] rounded-br-xs'
                  : 'bg-[#FCFAF7] dark:bg-[#202024] text-[#191919] dark:text-[#F0F0EE] border border-[rgba(0,0,0,0.05)] dark:border-[#2E2E33] rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>

            {/* Clickable Cited Cards */}
            {msg.citedCards && msg.citedCards.length > 0 && (
              <div className="mt-2.5 w-full space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9C9994] dark:text-[#6E6C68] block">
                  Citations ({msg.citedCards.length}):
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {msg.citedCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => onSelectCard(card)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#18181B] border border-[rgba(0,0,0,0.06)] dark:border-[#2E2E33] hover:border-[#FF5924] text-left flex items-center justify-between group transition-colors shadow-2xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] uppercase font-mono font-semibold text-[#FF5924] block">
                          {card.type}
                        </span>
                        <h5 className="font-editorial text-xs font-medium text-[#191919] dark:text-[#F5F4F2] truncate group-hover:text-[#FF5924]">
                          {card.title}
                        </h5>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9C9994] group-hover:text-[#FF5924] flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-[#748297] font-body p-3 bg-[#FCFAF7] dark:bg-[#202024] rounded-2xl w-fit">
            <span className="w-2 h-2 rounded-full bg-[#FF5924] animate-pulse" />
            <span>Consulting your memory embeddings...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about your saved cards..."
          className="flex-1 px-4 py-2.5 text-xs rounded-full bg-[#FCFAF7] dark:bg-[#151517] border border-[rgba(0,0,0,0.06)] dark:border-[#2D2D31] text-[#191919] dark:text-[#F5F4F2] placeholder:text-[#9C9994] outline-none focus:border-[#FF5924] font-body"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 rounded-full bg-[#191919] hover:bg-[#2E2E2E] dark:bg-[#FCFAF7] dark:hover:bg-[#E8E6E1] text-white dark:text-[#191919] disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
