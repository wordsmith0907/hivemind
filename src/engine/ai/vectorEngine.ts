import { Card } from '../../types/card';

/**
 * High-speed client-side Semantic Vector Engine & Similarity Calculator.
 * Enables Hivemind's "Same Vibe" and "|| Semantic Search" without server latency.
 */

const SEMANTIC_CLUSTERS: Record<string, string[]> = {
  design: ['ui', 'ux', 'typography', 'font', 'graphic', 'minimal', 'poster', 'layout', 'aesthetic', 'palette', 'art', 'branding'],
  technology: ['code', 'software', 'programming', 'developer', 'react', 'typescript', 'api', 'github', 'ai', 'database', 'system'],
  reading: ['book', 'article', 'essay', 'author', 'literature', 'quote', 'read', 'wisdom', 'story', 'chapter', 'novel'],
  lifestyle: ['fashion', 'interior', 'furniture', 'architecture', 'coffee', 'travel', 'home', 'decor', 'kitchen', 'recipe'],
  productivity: ['todo', 'task', 'goal', 'project', 'plan', 'focus', 'checklist', 'work', 'deadline', 'habit'],
  media: ['video', 'movie', 'film', 'cinema', 'youtube', 'music', 'album', 'sound', 'podcast', 'track'],
  commerce: ['product', 'shop', 'buy', 'price', 'store', 'cart', 'brand', 'ecommerce', 'item', 'apparel']
};

export class VectorEngine {
  /**
   * Generates a dense normalized feature vector (dimension: 64) for a Card
   */
  public static embedCard(card: Card): number[] {
    const textCorpus = [
      card.title || '',
      card.content || '',
      card.type,
      card.domain || '',
      ...(card.tags?.map(t => t.name) || []),
      ...(card.colorPalette?.colorNames || [])
    ].join(' ').toLowerCase();

    return this.textToVector(textCorpus, card.colorPalette?.hexPalette);
  }

  /**
   * Generates a semantic vector for arbitrary search queries
   */
  public static embedQuery(query: string): number[] {
    return this.textToVector(query.toLowerCase());
  }

  /**
   * Computes cosine similarity between two normalized vectors
   */
  public static cosineSimilarity(
    vecA: number[] | Float32Array | any, 
    vecB: number[] | Float32Array | any
  ): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.max(0, Math.min(1, (similarity + 1) / 2));
  }

  /**
   * Finds the "Same Vibe" cards for a given selected card
   */
  public static findSameVibe(targetCard: Card, allCards: Card[], limit: number = 6): Card[] {
    const targetVector = targetCard.embedding || this.embedCard(targetCard);

    const scored = allCards
      .filter(c => c.id !== targetCard.id)
      .map(card => {
        const cardVec = card.embedding || this.embedCard(card);
        let score = this.cosineSimilarity(targetVector, cardVec);

        // Boost score if color palettes harmonize
        if (targetCard.colorPalette?.dominant && card.colorPalette?.dominant) {
          if (targetCard.colorPalette.dominant === card.colorPalette.dominant) {
            score += 0.15;
          }
        }

        // Boost if they share high-confidence tags
        const commonTags = card.tags.filter(t => 
          targetCard.tags.some(tt => tt.name.toLowerCase() === t.name.toLowerCase())
        );
        score += commonTags.length * 0.05;

        return { card, score };
      });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.card);
  }

  /**
   * Ranks cards by semantic similarity to a query string
   */
  public static semanticSearch(query: string, cards: Card[], minScore: number = 0.40): Card[] {
    const queryVector = this.embedQuery(query);

    return cards
      .map(card => {
        const cardVector = card.embedding || this.embedCard(card);
        const score = this.cosineSimilarity(queryVector, cardVector);
        return { card, score };
      })
      .filter(item => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .map(item => item.card);
  }

  private static textToVector(text: string, hexColors?: string[]): number[] {
    const dim = 64;
    const vector = new Array(dim).fill(0);
    const words = text.split(/\W+/).filter(w => w.length > 2);

    // 1. Term Hash Projections (dimensions 0-31)
    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = (hash << 5) - hash + word.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % 32;
      vector[idx] += 1;
    }

    // 2. Semantic Domain Cluster Alignment (dimensions 32-47)
    let clusterIdx = 32;
    for (const [_cluster, clusterKeywords] of Object.entries(SEMANTIC_CLUSTERS)) {
      if (clusterIdx >= 48) break;
      let clusterWeight = 0;
      for (const kw of clusterKeywords) {
        if (text.includes(kw)) {
          clusterWeight += 1.5;
        }
      }
      vector[clusterIdx] = clusterWeight;
      clusterIdx++;
    }

    // 3. Color Hue & Temperature Channels (dimensions 48-63)
    if (hexColors && hexColors.length > 0) {
      for (let i = 0; i < Math.min(hexColors.length, 5); i++) {
        const hex = hexColors[i].replace('#', '');
        if (hex.length === 6) {
          const r = parseInt(hex.substring(0, 2), 16) / 255;
          const g = parseInt(hex.substring(2, 4), 16) / 255;
          const b = parseInt(hex.substring(4, 6), 16) / 255;
          
          const slot = 48 + (i * 3);
          if (slot < dim) vector[slot] = r;
          if (slot + 1 < dim) vector[slot + 1] = g;
          if (slot + 2 < dim) vector[slot + 2] = b;
        }
      }
    }

    // Normalize vector (L2 norm)
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < dim; i++) {
        vector[i] /= norm;
      }
    }

    return vector;
  }
}
