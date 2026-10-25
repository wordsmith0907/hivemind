import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '../../types/card';

interface TodoCardProps {
  card: Card;
  onToggleTodoItem?: (cardId: string, itemId: string, e: React.MouseEvent) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({ card, onToggleTodoItem }) => {
  return (
    <div className="p-6 bg-white dark:bg-[#1A1A1D]">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-body text-sm font-semibold text-[#191919] dark:text-[#F5F4F2]">
          {card.title}
        </h3>
        {card.metadata?.todo?.progressPercent !== undefined && (
          <span className="text-[11px] font-mono text-[#5CB13E] font-medium">
            {card.metadata.todo.progressPercent}%
          </span>
        )}
      </div>

      <div className="space-y-2.5 mt-2">
        {card.metadata?.todo?.items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              onToggleTodoItem?.(card.id, item.id, e);
            }}
            className="flex items-start gap-2.5 text-xs cursor-pointer group/todo select-none"
          >
            <div className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center border transition-colors ${
              item.completed 
                ? 'bg-[#5CB13E] border-[#5CB13E] text-white' 
                : 'border-[#EAE6DF] dark:border-[#3A3A40] group-hover/todo:border-[#5CB13E]'
            }`}>
              {item.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span className={`flex-1 leading-snug transition-colors ${
              item.completed 
                ? 'line-through text-[#9C9994] dark:text-[#6E6C68]' 
                : 'text-[#191919] dark:text-[#F5F4F2]'
            }`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
