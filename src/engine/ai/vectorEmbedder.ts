import { Card, CardType } from '../../types/card';

export class VectorEmbedder {
  public static readonly VECTOR_DIM = 128;

  /**
   * Generates a 128-dimensional normalized dense feature vector
   * combining color, type, lexical hashing, and structural metrics.
   */
  public static embedCard(card: Card): Float32Array {
    const vec = new Float32Array(this.VECTOR_DIM);

    // 1. Color Histogram & Saturation (Dimensions 0 to 31)
    if (card.colorPalette?.hexPalette) {
      for (let i = 0; i < Math.min(5, card.colorPalette.hexPalette.length); i++) {
        const hex = card.colorPalette.hexPalette[i];
        const { h, s, l } = this.hexToHsl(hex);
        const hueBin = Math.floor((h / 360) * 16) % 16;
        vec[hueBin] += 0.2; // Hue weight
        vec[16 + (i * 3)] = s;
        vec[16 + (i * 3) + 1] = l;
      }
    }

    // 2. Category One-Hot (Dimensions 32 to 47)
    const typeIndexMap: Record<CardType, number> = {
      note: 32,
      article: 33,
      image: 34,
      quote: 35,
      product: 36,
      book: 37,
      todo: 38,
      code: 39,
      video: 40,
      audio: 41,
      pdf: 42
    };
    const tIdx = typeIndexMap[card.type] || 32;
    vec[tIdx] = 1.0;

    // 3. Lexical TF-IDF Hashing (Dimensions 48 to 111 - 64 dims)
    const textCorpus = `${card.title} ${card.tags.map((t) => t.name).join(' ')} ${card.domain || ''}`.toLowerCase();
    const words = textCorpus.split(/\s+/).filter((w) => w.length > 2);

    for (const word of words) {
      const hash = Math.abs(this.hashString(word)) % 64;
      vec[48 + hash] += 0.15;
    }

    // 4. Structural Metrics (Dimensions 112 to 127)
    const wordCount = card.wordCount || card.content.split(/\s+/).length;
    vec[112] = Math.min(1.0, wordCount / 1000); // normalized length
    vec[113] = Math.min(1.0, (card.readingTimeMinutes || 1) / 10);
    vec[114] = card.isFavorite ? 1.0 : 0.0;
    vec[115] = card.thumbnailUrl ? 1.0 : 0.0;
    vec[116] = card.mindLinks.length > 0 ? 1.0 : 0.0;

    // Normalize vector to unit length (L2 norm)
    this.normalize(vec);
    return vec;
  }

  /**
   * Fast cosine similarity between two Float32Arrays of identical length
   */
  public static cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dot = 0.0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
    }
    return dot;
  }

  /**
   * Finds the Top-K most similar cards to a query card ("Same Vibe")
   */
  public static findSameVibe(
    targetCard: Card,
    allCards: Card[],
    limit = 6
  ): Array<{ card: Card; similarity: number }> {
    if (!targetCard.embedding) {
      targetCard.embedding = this.embedCard(targetCard);
    }

    const results: Array<{ card: Card; similarity: number }> = [];

    for (const card of allCards) {
      if (card.id === targetCard.id) continue;
      if (!card.embedding) {
        card.embedding = this.embedCard(card);
      }

      const sim = this.cosineSimilarity(targetCard.embedding, card.embedding);
      results.push({ card, similarity: sim });
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }

  private static normalize(vec: Float32Array): void {
    let sumSq = 0;
    for (let i = 0; i < vec.length; i++) {
      sumSq += vec[i] * vec[i];
    }
    const norm = Math.sqrt(sumSq);
    if (norm > 0) {
      for (let i = 0; i < vec.length; i++) {
        vec[i] /= norm;
      }
    }
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  private static hexToHsl(hex: string): { h: number; s: number; l: number } {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16) || 0;
    const r = (num >> 16) / 255;
    const g = ((num >> 8) & 0xff) / 255;
    const b = (num & 0xff) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s, l };
  }
}
