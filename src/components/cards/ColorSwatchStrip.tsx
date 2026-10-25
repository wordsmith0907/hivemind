import React, { useState } from 'react';
import { ColorPalette } from '../../types/card';

interface ColorSwatchStripProps {
  colorPalette?: ColorPalette;
}

export const ColorSwatchStrip: React.FC<ColorSwatchStripProps> = ({ colorPalette }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!colorPalette?.hexPalette || colorPalette.hexPalette.length === 0) {
    return null;
  }

  const handleCopyHex = (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="px-4 py-2 bg-[#FCFAF7] dark:bg-[#18181A] border-t border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.06)] flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {colorPalette.hexPalette.slice(0, 5).map((hex, i) => (
          <button
            key={i}
            onClick={(e) => handleCopyHex(hex, e)}
            title={`Copy ${hex}`}
            className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 hover:scale-125 transition-transform"
            style={{ backgroundColor: hex }}
            aria-label={`Copy color ${hex}`}
          />
        ))}
      </div>

      {copiedHex ? (
        <span className="text-[10px] font-mono text-[#5CB13E] font-semibold animate-in fade-in">
          {copiedHex} Copied!
        </span>
      ) : colorPalette.colorNames?.[0] ? (
        <span className="text-[10px] font-body text-[#8A8782] dark:text-[#A3A19D] truncate max-w-[120px]">
          {colorPalette.colorNames[0]}
        </span>
      ) : null}
    </div>
  );
};
