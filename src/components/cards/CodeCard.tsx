import React from 'react';
import { Card } from '../../types/card';

interface CodeCardProps {
  card: Card;
}

export const CodeCard: React.FC<CodeCardProps> = ({ card }) => {
  return (
    <div className="p-5 bg-[#1A1B26] text-[#C0CAF5]">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-700/60">
        <span className="text-xs font-mono text-[#7AA2F7]">
          {card.metadata?.code?.language || 'typescript'}
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {card.metadata?.code?.lineCount || 10} lines
        </span>
      </div>
      <pre className="font-mono text-xs overflow-x-auto p-1 leading-relaxed text-[#A9B1D6]">
        <code>{card.content}</code>
      </pre>
    </div>
  );
};
