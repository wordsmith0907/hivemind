import { ASTNode, FilterNode } from '../../types/search';
import { Card } from '../../types/card';

export interface CompiledQuery {
  dexiePreFilter?: {
    field: string;
    value: any;
  };
  inMemoryPredicate: (card: Card) => boolean;
  semanticQuery?: string;
  hasFilter: boolean;
}

export class QueryCompiler {
  public static compile(ast: ASTNode | null): CompiledQuery {
    if (!ast) {
      return {
        inMemoryPredicate: () => true,
        hasFilter: false
      };
    }

    let semanticQuery: string | undefined;

    // Detect if top-level has a single indexed filter to optimize Dexie index scan
    const dexiePreFilter = this.extractDexieIndexCandidate(ast);

    // Recursively build in-memory predicate
    const predicate = this.buildPredicate(ast, (vibe) => {
      semanticQuery = vibe;
    });

    return {
      dexiePreFilter,
      inMemoryPredicate: predicate,
      semanticQuery,
      hasFilter: true
    };
  }

  private static extractDexieIndexCandidate(node: ASTNode): { field: string; value: any } | undefined {
    if (node.type === 'FILTER') {
      if (node.field === 'type') {
        return { field: 'type', value: node.value.toLowerCase() };
      }
      if (node.field === 'site') {
        return { field: 'domain', value: node.value.toLowerCase() };
      }
    }
    return undefined;
  }

  private static buildPredicate(
    node: ASTNode,
    onVibeDetected: (query: string) => void
  ): (card: Card) => boolean {
    switch (node.type) {
      case 'LOGICAL': {
        const leftPred = this.buildPredicate(node.left, onVibeDetected);
        const rightPred = this.buildPredicate(node.right, onVibeDetected);
        if (node.operator === 'AND') {
          return (card: Card) => leftPred(card) && rightPred(card);
        } else {
          return (card: Card) => leftPred(card) || rightPred(card);
        }
      }

      case 'NOT': {
        const childPred = this.buildPredicate(node.child, onVibeDetected);
        return (card: Card) => !childPred(card);
      }

      case 'TEXT': {
        const keyword = node.value.toLowerCase();
        return (card: Card) => {
          if (card.title?.toLowerCase().includes(keyword)) return true;
          if (card.excerpt?.toLowerCase().includes(keyword)) return true;
          if (card.content?.toLowerCase().includes(keyword)) return true;
          if (card.domain?.toLowerCase().includes(keyword)) return true;
          if (card.siteName?.toLowerCase().includes(keyword)) return true;
          if (card.ocrText?.toLowerCase().includes(keyword)) return true;
          if (card.tags?.some((t) => t.name.toLowerCase().includes(keyword))) return true;
          if (card.colorPalette?.colorNames?.some((c) => c.toLowerCase().includes(keyword))) return true;
          return false;
        };
      }

      case 'EXACT_PHRASE': {
        const phrase = node.phrase.toLowerCase();
        return (card: Card) => {
          if (card.title?.toLowerCase().includes(phrase)) return true;
          if (card.content?.toLowerCase().includes(phrase)) return true;
          if (card.excerpt?.toLowerCase().includes(phrase)) return true;
          if (card.ocrText?.toLowerCase().includes(phrase)) return true;
          return false;
        };
      }

      case 'FILTER': {
        return this.buildFilterPredicate(node);
      }

      case 'VIBE_SEMANTIC': {
        onVibeDetected(node.query);
        // In the binary predicate stage, semantic similarity passes through;
        // ranking/scoring is handled by the vector similarity worker
        return () => true;
      }

      default:
        return () => true;
    }
  }

  private static buildFilterPredicate(node: FilterNode): (card: Card) => boolean {
    const val = node.value.toLowerCase();

    switch (node.field) {
      case 'type':
        return (card: Card) => card.type.toLowerCase() === val;

      case 'format':
        return (card: Card) => {
          if (val === 'pdf') return card.type === 'pdf' || card.url?.endsWith('.pdf') === true;
          if (val === 'image') return card.type === 'image' || !!card.thumbnailUrl;
          if (val === 'video') return card.type === 'video' || card.url?.includes('youtube') === true;
          return false;
        };

      case 'site':
        return (card: Card) => {
          return (
            card.domain?.toLowerCase().includes(val) ||
            card.url?.toLowerCase().includes(val) ||
            card.siteName?.toLowerCase().includes(val) ||
            false
          );
        };

      case 'tag':
        return (card: Card) => {
          return card.tags?.some((t) => t.name.toLowerCase() === val) || false;
        };

      case 'color':
        return (card: Card) => {
          if (!card.colorPalette) return false;
          // Check named color matches
          if (card.colorPalette.colorNames?.some((c) => c.toLowerCase().includes(val))) {
            return true;
          }
          // Check hex match
          if (card.colorPalette.hexPalette?.some((h) => h.toLowerCase() === val)) {
            return true;
          }
          return false;
        };

      case 'object':
        return (card: Card) => {
          return card.detectedObjects?.some((obj) => obj.toLowerCase().includes(val)) || false;
        };

      case 'text':
        return (card: Card) => {
          return card.ocrText?.toLowerCase().includes(val) || false;
        };

      case 'completed': {
        const isCompleted = val === 'true';
        return (card: Card) => {
          if (card.type !== 'todo' || !card.metadata?.todo) return false;
          const { items } = card.metadata.todo;
          if (!items || items.length === 0) return false;
          const allDone = items.every((item) => item.completed);
          return isCompleted ? allDone : !allDone;
        };
      }

      case 'action':
        return (card: Card) => {
          if (val === 'read') return card.type === 'article' || card.type === 'book';
          if (val === 'buy') return card.type === 'product';
          if (val === 'watch') return card.type === 'video';
          return false;
        };

      default:
        return () => true;
    }
  }
}
