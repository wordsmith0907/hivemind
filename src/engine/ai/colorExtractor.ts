import { ColorPalette } from '../../types/card';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface Lab {
  L: number;
  a: number;
  b: number;
}

// Curated palette of named design shades for human-relatable color search
const COLOR_NAMES_DICT: Array<{ name: string; rgb: RGB; hex: string }> = [
  { name: 'terracotta', rgb: { r: 212, g: 91, b: 58 }, hex: '#d45b3a' },
  { name: 'warm ochre', rgb: { r: 219, g: 153, b: 56 }, hex: '#db9938' },
  { name: 'sage green', rgb: { r: 152, g: 168, b: 142 }, hex: '#98a88e' },
  { name: 'forest pine', rgb: { r: 43, g: 76, b: 63 }, hex: '#2b4c3f' },
  { name: 'midnight navy', rgb: { r: 25, g: 39, b: 52 }, hex: '#192734' },
  { name: 'electric cobalt', rgb: { r: 24, g: 76, b: 245 }, hex: '#184cf5' },
  { name: 'powder blue', rgb: { r: 176, g: 204, b: 219 }, hex: '#b0ccdb' },
  { name: 'blush rose', rgb: { r: 232, g: 178, b: 178 }, hex: '#e8b2b2' },
  { name: 'crimson red', rgb: { r: 194, g: 38, b: 45 }, hex: '#c2262d' },
  { name: 'deep charcoal', rgb: { r: 40, g: 40, b: 42 }, hex: '#28282a' },
  { name: 'warm ivory', rgb: { r: 250, g: 246, b: 238 }, hex: '#faf6ee' },
  { name: 'mustard yellow', rgb: { r: 227, g: 177, b: 43 }, hex: '#e3b12b' },
  { name: 'plum violet', rgb: { r: 110, g: 54, b: 95 }, hex: '#6e365f' },
  { name: 'lavender', rgb: { r: 198, g: 184, b: 224 }, hex: '#c6b8e0' },
  { name: 'caramel bronze', rgb: { r: 168, g: 104, b: 50 }, hex: '#a86832' },
  { name: 'mint cyan', rgb: { r: 135, g: 214, b: 194 }, hex: '#87d6c2' }
];

export class ColorExtractor {
  /**
   * Extracts dominant color palette from an ImageBitmap, HTMLImageElement, or raw RGBA buffer
   */
  public static extractFromPixelData(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): ColorPalette {
    const pixels: RGB[] = [];
    const step = Math.max(1, Math.floor((width * height) / 1024)); // sample ~1024 pixels

    for (let i = 0; i < data.length; i += 4 * step) {
      const a = data[i + 3];
      if (a < 128) continue; // skip transparent

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Exclude extreme white / extreme black from vibrant calculations
      pixels.push({ r, g, b });
    }

    if (pixels.length === 0) {
      return this.getDefaultPalette();
    }

    // Median-cut quantization to 8 buckets
    const quantized = this.medianCut(pixels, 8);
    const hexPalette = quantized.map((rgb) => this.rgbToHex(rgb));

    // Calculate dominant, vibrant, muted
    const dominant = hexPalette[0] || '#2b4c3f';
    const vibrant = this.findMostVibrant(quantized) || hexPalette[1] || dominant;
    const muted = this.findMuted(quantized) || hexPalette[2] || '#d8cfc4';

    // Perceptual color names in CIELAB space
    const colorNames = Array.from(
      new Set(
        quantized.slice(0, 3).map((rgb) => this.matchColorName(rgb))
      )
    );

    return {
      dominant,
      vibrant,
      muted,
      darkVariant: this.adjustLightness(dominant, -0.3),
      lightVariant: this.adjustLightness(dominant, 0.4),
      hexPalette: hexPalette.slice(0, 5),
      colorNames
    };
  }

  private static medianCut(pixels: RGB[], depth: number): RGB[] {
    if (depth === 0 || pixels.length === 0) {
      return [this.averageColor(pixels)];
    }

    // Find channel with maximum range
    let minR = 255, maxR = 0;
    let minG = 255, maxG = 0;
    let minB = 255, maxB = 0;

    for (const p of pixels) {
      minR = Math.min(minR, p.r); maxR = Math.max(maxR, p.r);
      minG = Math.min(minG, p.g); maxG = Math.max(maxG, p.g);
      minB = Math.min(minB, p.b); maxB = Math.max(maxB, p.b);
    }

    const rangeR = maxR - minR;
    const rangeG = maxG - minG;
    const rangeB = maxB - minB;
    const maxRange = Math.max(rangeR, rangeG, rangeB);

    let channel: 'r' | 'g' | 'b' = 'r';
    if (maxRange === rangeG) channel = 'g';
    if (maxRange === rangeB) channel = 'b';

    pixels.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(pixels.length / 2);

    return [
      ...this.medianCut(pixels.slice(0, mid), depth - 1),
      ...this.medianCut(pixels.slice(mid), depth - 1)
    ];
  }

  private static averageColor(pixels: RGB[]): RGB {
    if (pixels.length === 0) return { r: 128, g: 128, b: 128 };
    let r = 0, g = 0, b = 0;
    for (const p of pixels) {
      r += p.r;
      g += p.g;
      b += p.b;
    }
    return {
      r: Math.round(r / pixels.length),
      g: Math.round(g / pixels.length),
      b: Math.round(b / pixels.length)
    };
  }

  private static findMostVibrant(colors: RGB[]): string | null {
    let maxSaturation = -1;
    let bestRgb: RGB | null = null;

    for (const rgb of colors) {
      const max = Math.max(rgb.r, rgb.g, rgb.b);
      const min = Math.min(rgb.r, rgb.g, rgb.b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const lum = (max + min) / (2 * 255);

      if (sat > maxSaturation && lum > 0.25 && lum < 0.85) {
        maxSaturation = sat;
        bestRgb = rgb;
      }
    }

    return bestRgb ? this.rgbToHex(bestRgb) : null;
  }

  private static findMuted(colors: RGB[]): string | null {
    let bestRgb: RGB | null = null;
    let minDiff = 999;

    for (const rgb of colors) {
      const max = Math.max(rgb.r, rgb.g, rgb.b);
      const min = Math.min(rgb.r, rgb.g, rgb.b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (sat > 0.08 && sat < 0.35) {
        return this.rgbToHex(rgb);
      }
    }

    return null;
  }

  private static matchColorName(rgb: RGB): string {
    const lab1 = this.rgbToLab(rgb);
    let minDeltaE = Infinity;
    let bestName = 'neutral';

    for (const entry of COLOR_NAMES_DICT) {
      const lab2 = this.rgbToLab(entry.rgb);
      const dE = Math.sqrt(
        Math.pow(lab1.L - lab2.L, 2) +
        Math.pow(lab1.a - lab2.a, 2) +
        Math.pow(lab1.b - lab2.b, 2)
      );

      if (dE < minDeltaE) {
        minDeltaE = dE;
        bestName = entry.name;
      }
    }

    return bestName;
  }

  public static rgbToLab(rgb: RGB): Lab {
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    const fx = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
    const fy = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
    const fz = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;

    return {
      L: 116 * fy - 16,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz)
    };
  }

  public static rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  private static adjustLightness(hex: string, delta: number): string {
    // Basic hex lightness adjustment
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + Math.round(delta * 255);
    let g = ((num >> 8) & 0x00ff) + Math.round(delta * 255);
    let b = (num & 0x0000ff) + Math.round(delta * 255);
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  public static getDefaultPalette(): ColorPalette {
    return {
      dominant: '#232323',
      vibrant: '#e05a47',
      muted: '#d8cfc4',
      darkVariant: '#111111',
      lightVariant: '#f7f6f4',
      hexPalette: ['#232323', '#e05a47', '#d8cfc4', '#87a292', '#f7f6f4'],
      colorNames: ['charcoal', 'terracotta']
    };
  }
}
