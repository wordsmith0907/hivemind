import { CardTag, CardType, ColorPalette, CardMetadata } from '../../types/card';

export interface TaggingInput {
  title: string;
  content: string;
  type: CardType;
  url?: string;
  domain?: string;
  colorPalette?: ColorPalette;
  detectedObjects?: string[];
  metadata?: CardMetadata;
}

export class ReasoningTagger {
  public static generateTags(input: TaggingInput): CardTag[] {
    const tags: CardTag[] = [];
    const addedNames = new Set<string>();

    const addTag = (
      name: string,
      confidence: number,
      source: CardTag['source'],
      reason: string
    ) => {
      const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_\-\s]/g, '');
      if (cleanName.length < 2 || addedNames.has(cleanName)) return;
      addedNames.add(cleanName);
      tags.push({
        id: `tag-${Math.random().toString(36).substring(2, 9)}`,
        name: cleanName,
        confidence: Math.round(confidence * 100) / 100,
        source,
        reason
      });
    };

    // 1. Content Type Tag
    addTag(
      input.type,
      0.95,
      'meta_schema',
      `Classified as ${input.type} from structural analysis and layout`
    );

    // 2. Color Palette Tags
    if (input.colorPalette?.colorNames) {
      for (const colorName of input.colorPalette.colorNames) {
        addTag(
          colorName,
          0.93,
          'color_vision',
          `Color analysis detected ${colorName} (${input.colorPalette.dominant}) in visual palette`
        );
      }
    }

    // 3. Domain & Platform Tag
    if (input.domain) {
      const cleanDomain = input.domain.replace(/^www\./, '').split('.')[0];
      if (cleanDomain && cleanDomain.length > 2) {
        addTag(
          cleanDomain,
          0.99,
          'url_domain',
          `Captured from source domain ${input.domain}`
        );
      }
    }

    // 4. Reading Length Tags
    const wordCount = input.content.split(/\s+/).filter(Boolean).length;
    if (wordCount > 0 && wordCount < 400) {
      addTag('quick read', 0.91, 'text_nlp', `Short reading length (${wordCount} words, ~2 min)`);
    } else if (wordCount > 1500) {
      addTag('deep dive', 0.89, 'text_nlp', `Long-form reading (${wordCount} words, ~8+ min)`);
    }

    // 5. Vision Objects (if detected)
    if (input.detectedObjects) {
      for (const obj of input.detectedObjects) {
        addTag(
          obj,
          0.87,
          'color_vision',
          `Object detection model recognized "${obj}" in visual media`
        );
      }
    }

    // 6. Curated Topic Heuristics (NLP keyword patterns)
    const textBlob = `${input.title} ${input.content}`.toLowerCase();

    const topicRules: Array<{
      tag: string;
      patterns: RegExp[];
      reason: string;
    }> = [
      {
        tag: 'architecture',
        patterns: [/facade/, /architect/, /concrete/, /brutalis/, /interior design/, /blueprint/],
        reason: 'Architectural terminology and structural keywords detected'
      },
      {
        tag: 'typography',
        patterns: [/serif/, /sans-serif/, /kerning/, /typeface/, /font family/, /ligature/],
        reason: 'Typography and editorial type design vocabulary detected'
      },
      {
        tag: 'minimalism',
        patterns: [/minimalist/, /monochrome/, /negative space/, /zen/, /clean lines/],
        reason: 'Minimalist aesthetics and composition cues detected'
      },
      {
        tag: 'development',
        patterns: [/javascript/, /typescript/, /react/, /python/, /github/, /api/, /database/],
        reason: 'Software engineering & coding references identified'
      },
      {
        tag: 'industrial design',
        patterns: [/ergonomic/, /materials/, /aluminum/, /product design/, /form factor/, /dieter rams/],
        reason: 'Industrial product design and material references detected'
      }
    ];

    for (const rule of topicRules) {
      const matchCount = rule.patterns.filter((p) => p.test(textBlob)).length;
      if (matchCount >= 2) {
        const conf = Math.min(0.96, 0.75 + matchCount * 0.08);
        addTag(rule.tag, conf, 'text_nlp', rule.reason);
      }
    }

    // 7. Product specific tags
    if (input.metadata?.product?.price) {
      addTag(
        'shopping',
        0.92,
        'meta_schema',
        `Priced item with currency ${input.metadata.product.currency || 'USD'}`
      );
    }

    return tags;
  }
}
