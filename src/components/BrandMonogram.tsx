import React from 'react';

interface BrandMonogramProps {
  className?: string;
  showWordmark?: boolean;
}

export const BrandMonogram: React.FC<BrandMonogramProps> = ({ 
  className = "",
  showWordmark = true 
}) => {
  return (
    <div className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}>
      {/* Bespoke Geometric Mind Glyph (Original Design) */}
      <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF5924] via-[#FF7DD3] to-[#FFE926] p-[1.5px] shadow-sm group-hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full rounded-full bg-[#FCFAF7] dark:bg-[#121214] flex items-center justify-center">
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-[#FF5924] dark:text-[#fbfaf8]"
          >
            {/* Elegant double looped infinity brain spiral */}
            <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
            <path d="M12 12a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5 5 5 0 0 1-5-5v-1a5 5 0 0 1 5-5z" opacity="0.6" />
          </svg>
        </div>
      </div>

      {showWordmark && (
        <span className="font-editorial text-2xl font-medium tracking-tight text-[#191919] dark:text-[#FCFAF7]">
          hivemind
        </span>
      )}
    </div>
  );
};
