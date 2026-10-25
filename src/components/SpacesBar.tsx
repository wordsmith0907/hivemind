import React from 'react';
import { Plus } from 'lucide-react';

export interface SpaceItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  isSmart: boolean;
  filterQuery?: string;
  icon?: string;
  count?: number;
}

interface SpacesBarProps {
  spaces: SpaceItem[];
  activeSpaceId: string;
  onSelectSpace: (space: SpaceItem) => void;
  onCreateSpace: () => void;
}

export const SpacesBar: React.FC<SpacesBarProps> = ({
  spaces,
  activeSpaceId,
  onSelectSpace,
  onCreateSpace
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 my-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {spaces.map((space) => {
          const isActive = space.id === activeSpaceId;
          return (
            <button
              key={space.id}
              onClick={() => onSelectSpace(space)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-[#191919] dark:bg-[#fbfaf8] border-[#191919] dark:border-[#fbfaf8] text-white dark:text-[#191919] shadow-sm scale-[1.02]'
                  : 'bg-[#f0eae1]/50 dark:bg-[#1a1a1d]/60 border-transparent text-[#66635e] dark:text-[#999690] hover:bg-[#e8e2d8] dark:hover:bg-[#252528]'
              }`}
            >
              {/* Space Accent Dot */}
              <span
                className="w-2 h-2 rounded-full border border-black/10 dark:border-white/20 flex-shrink-0"
                style={{ backgroundColor: space.color }}
              />

              <span>{space.name}</span>

              {space.isSmart && (
                <span className="text-[10px] text-[#FFE926] opacity-90" title="Smart Space (Auto-updating query)">
                  ⚡
                </span>
              )}

              {typeof space.count === 'number' && (
                <span className={`text-[10px] font-mono ${isActive ? 'opacity-75' : 'opacity-60'}`}>
                  {space.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Create Space Button */}
        <button
          onClick={onCreateSpace}
          title="Create New Space or Smart Space"
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#706e6b] dark:text-[#8a8782] hover:bg-[#f0eae1] dark:hover:bg-[#252528] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Space</span>
        </button>
      </div>
    </div>
  );
};
