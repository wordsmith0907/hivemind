import { CardType, CardMetadata } from '../../types/card';

export interface TypeClassificationResult {
  type: CardType;
  confidence: number;
  reason: string;
  inferredMetadata?: CardMetadata;
}

export class TypeClassifier {
  public static classify(params: {
    url?: string;
    title?: string;
    content: string;
    mediaUrls?: string[];
    rawMetadata?: Record<string, any>;
  }): TypeClassificationResult {
    const { url = '', title = '', content, mediaUrls = [], rawMetadata = {} } = params;
    const lowerUrl = url.toLowerCase();
    const cleanContent = content.trim();

    // 1. PDF Filter
    if (lowerUrl.endsWith('.pdf') || rawMetadata['contentType'] === 'application/pdf') {
      return {
        type: 'pdf',
        confidence: 0.99,
        reason: 'URL ends with .pdf extension or returned PDF mime-type'
      };
    }

    // 2. Video Classifier
    if (
      lowerUrl.includes('youtube.com/watch') ||
      lowerUrl.includes('youtu.be/') ||
      lowerUrl.includes('vimeo.com/') ||
      lowerUrl.includes('tiktok.com/')
    ) {
      let platform: 'youtube' | 'vimeo' | 'tiktok' | 'other' = 'other';
      if (lowerUrl.includes('youtu')) platform = 'youtube';
      else if (lowerUrl.includes('vimeo')) platform = 'vimeo';
      else if (lowerUrl.includes('tiktok')) platform = 'tiktok';

      return {
        type: 'video',
        confidence: 0.98,
        reason: `Matched video platform domain (${platform})`,
        inferredMetadata: {
          video: {
            platform,
            embedUrl: url
          }
        }
      };
    }

    // 3. Audio Classifier
    if (
      lowerUrl.includes('spotify.com/track') ||
      lowerUrl.includes('soundcloud.com/') ||
      lowerUrl.includes('podcasts.apple.com') ||
      rawMetadata['contentType']?.startsWith('audio/')
    ) {
      return {
        type: 'audio',
        confidence: 0.95,
        reason: 'Audio stream or streaming service URL recognized'
      };
    }

    // 4. Todo / Checklist Classifier
    const todoRegex = /^\s*-\s*\[([ xX])\]\s+(.*)$/m;
    if (todoRegex.test(cleanContent)) {
      const lines = cleanContent.split('\n');
      const items = lines
        .map((line, idx) => {
          const match = line.match(/^\s*-\s*\[([ xX])\]\s+(.*)$/);
          if (!match) return null;
          return {
            id: `item-${idx}`,
            completed: match[1].toLowerCase() === 'x',
            text: match[2].trim()
          };
        })
        .filter(Boolean) as Array<{ id: string; completed: boolean; text: string }>;

      if (items.length > 0) {
        const completedCount = items.filter((i) => i.completed).length;
        return {
          type: 'todo',
          confidence: 0.96,
          reason: `Detected ${items.length} markdown checklist items`,
          inferredMetadata: {
            todo: {
              items,
              progressPercent: Math.round((completedCount / items.length) * 100)
            }
          }
        };
      }
    }

    // 5. Code Snippet Classifier
    if (
      cleanContent.includes('```') ||
      lowerUrl.includes('gist.github.com') ||
      lowerUrl.includes('github.com/')
    ) {
      const codeMatch = cleanContent.match(/```(\w+)?\n([\s\S]*?)```/);
      const language = codeMatch ? codeMatch[1] || 'plaintext' : 'code';
      return {
        type: 'code',
        confidence: 0.92,
        reason: `Code block formatted with markdown triple backticks (${language})`,
        inferredMetadata: {
          code: {
            language,
            lineCount: cleanContent.split('\n').length
          }
        }
      };
    }

    // 6. Product & Commerce Classifier
    const priceRegex = /([$€£¥])\s?([0-9]+(?:[.,][0-9]{2})?)/;
    const priceMatch =
      cleanContent.match(priceRegex) ||
      (rawMetadata['og:price:amount'] ? [`${rawMetadata['og:price:currency'] || '$'}${rawMetadata['og:price:amount']}`, rawMetadata['og:price:currency'] || '$', rawMetadata['og:price:amount']] : null);

    const isEcommerceDomain =
      lowerUrl.includes('amazon.') ||
      lowerUrl.includes('etsy.com') ||
      lowerUrl.includes('shopify.com') ||
      lowerUrl.includes('store.') ||
      lowerUrl.includes('shop.');

    if (priceMatch || isEcommerceDomain) {
      const currencySymbols: Record<string, string> = { '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY' };
      const rawPrice = priceMatch ? parseFloat(priceMatch[2]?.replace(',', '')) : undefined;
      const currency = priceMatch ? currencySymbols[priceMatch[1]] || 'USD' : 'USD';

      return {
        type: 'product',
        confidence: isEcommerceDomain ? 0.94 : 0.82,
        reason: priceMatch
          ? `Detected price specification (${currency} ${rawPrice})`
          : 'Detected retail e-commerce domain',
        inferredMetadata: {
          product: {
            price: rawPrice,
            currency,
            productUrl: url
          }
        }
      };
    }

    // 7. Book Classifier
    const isbnRegex = /(?:ISBN(?:-1[03])?:?\s*)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\s]){3})[-\s0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\s]){4})[-\s0-9]{17}$)(?:97[89][-\s]?)?[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9X]/i;
    if (
      lowerUrl.includes('goodreads.com') ||
      lowerUrl.includes('books.google') ||
      isbnRegex.test(cleanContent)
    ) {
      return {
        type: 'book',
        confidence: 0.91,
        reason: 'Book identification from ISBN or literary archive domain'
      };
    }

    // 8. Quote Classifier
    const quoteMarks =
      (cleanContent.startsWith('"') && cleanContent.endsWith('"')) ||
      (cleanContent.startsWith('“') && cleanContent.endsWith('”'));
    const isShortWithAttribution =
      cleanContent.length < 350 && (cleanContent.includes('—') || cleanContent.includes('--'));

    if (quoteMarks || isShortWithAttribution) {
      let author = '';
      if (cleanContent.includes('—')) {
        author = cleanContent.split('—')[1]?.trim() || '';
      }
      return {
        type: 'quote',
        confidence: 0.95,
        reason: 'Quotation marks and concise attribution format detected',
        inferredMetadata: {
          quote: {
            author: author || undefined
          }
        }
      };
    }

    // 9. Image Classifier (Single standalone visual)
    if (mediaUrls.length > 0 && cleanContent.length < 100) {
      return {
        type: 'image',
        confidence: 0.89,
        reason: 'Image attachment with minimal accompanying text'
      };
    }

    // 10. Longform Article Classifier
    const wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
    if (wordCount > 300 || (url.length > 0 && wordCount > 150)) {
      return {
        type: 'article',
        confidence: 0.88,
        reason: `Structured editorial reading with ${wordCount} words`
      };
    }

    // 11. Default: Note
    return {
      type: 'note',
      confidence: 0.85,
      reason: 'Personal thought or quick text note'
    };
  }
}
