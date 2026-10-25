import { Card } from '../types/card';

export const INITIAL_CARDS: Card[] = [
  {
    id: 'card-1',
    workspaceId: 'ws-personal',
    type: 'article',
    title: 'The Architecture of Solitude: Designing Spaces for Deep Thought',
    excerpt: 'An investigation into how monastery courtyards, Japanese dry gardens, and Finnish library alcoves structure human contemplation.',
    content: `# The Architecture of Solitude: Designing Spaces for Deep Thought

Architecture has always had a secret dialogue with the human interior. When we step inside a space stripped of ornamentation, our mental chatter decelerates. 

> "We shape our buildings; thereafter, our buildings shape us." — Winston Churchill

## The Finnish Alcove
In Alvar Aalto's libraries, indirect clerestory daylight floods downward through conical skylights, eliminating glare. The reader feels simultaneously protected in an intimate nest and connected to the shifting clouds above.

## Japanese Engawa
The border between exterior veranda and interior tatami room is ambiguous. Neither inside nor outside, the engawa allows contemplation of rain without exposure to wetness.

### Key Principles for Modern Havens:
- **Acoustic Absorption:** Linen wall hangings, untreated oak, and cork floor underlayment.
- **Diffused Top-Lighting:** Eliminating harsh direct beams in favor of soft ambient perimeter wash.
- **Physical Boundary Markers:** Low thresholds and transition corridors that separate frantic street noise from meditative stillness.`,
    url: 'https://archdaily.com/architecture-of-solitude',
    domain: 'archdaily.com',
    siteName: 'ArchDaily',
    author: 'Juhani Pallasmaa',
    publishedAt: 'October 12, 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    colorPalette: {
      dominant: '#2b3a32',
      vibrant: '#d45b3a',
      muted: '#d8cfc4',
      darkVariant: '#19231e',
      lightVariant: '#e6ded4',
      hexPalette: ['#2b3a32', '#d45b3a', '#d8cfc4', '#8c7b6d', '#faf8f5'],
      colorNames: ['forest pine', 'terracotta', 'warm ochre', 'deep charcoal', 'warm ivory']
    },
    readingTimeMinutes: 4,
    wordCount: 840,
    tags: [
      { id: 't1', name: 'architecture', confidence: 0.98, source: 'meta_schema', reason: 'High frequency of architectural terms and ArchDaily publication' },
      { id: 't2', name: 'minimalism', confidence: 0.94, source: 'text_nlp', reason: 'Identified aesthetic concepts of stripped ornamentation and quiet spaces' },
      { id: 't3', name: 'terracotta', confidence: 0.91, source: 'color_vision', reason: 'Color analysis isolated #d45b3a accent tone' },
      { id: 't4', name: 'design', confidence: 0.97, source: 'url_domain', reason: 'Domain archdaily.com primary category' }
    ],
    detectedObjects: ['room', 'chair', 'sunlight', 'window'],
    spaceIds: ['space-design', 'space-reading'],
    mindLinks: ['card-2', 'card-4'],
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48
  },
  {
    id: 'card-2',
    workspaceId: 'ws-personal',
    type: 'quote',
    title: 'Dieter Rams on Honest Design',
    excerpt: 'Good design is honest. It does not make a product more innovative, powerful or valuable than it really is.',
    content: 'Good design is honest. It does not make a product more innovative, powerful or valuable than it really is. It does not attempt to manipulate the consumer with promises that cannot be kept.',
    metadata: {
      quote: {
        author: 'Dieter Rams',
        sourceTitle: 'Ten Principles for Good Design',
        context: 'Braun design philosophy lecture, Frankfurt 1976'
      }
    },
    colorPalette: {
      dominant: '#f4ede2',
      vibrant: '#c2410c',
      muted: '#78716c',
      darkVariant: '#292524',
      lightVariant: '#faf8f5',
      hexPalette: ['#f4ede2', '#c2410c', '#78716c', '#e7e5e4', '#1c1917'],
      colorNames: ['warm ivory', 'terracotta', 'deep charcoal']
    },
    tags: [
      { id: 't5', name: 'quote', confidence: 1.0, source: 'meta_schema', reason: 'Contains explicit quotation and Dieter Rams attribution' },
      { id: 't6', name: 'dieter rams', confidence: 0.99, source: 'text_nlp', reason: 'Recognized legendary industrial designer byline' },
      { id: 't7', name: 'industrial design', confidence: 0.95, source: 'text_nlp', reason: 'Principles for good design canonical corpus match' },
      { id: 't8', name: 'minimalism', confidence: 0.92, source: 'text_nlp', reason: 'Ethos of honesty, simplicity, and non-manipulation' }
    ],
    spaceIds: ['space-design'],
    mindLinks: ['card-1', 'card-3'],
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    updatedAt: Date.now() - 1000 * 60 * 60 * 36
  },
  {
    id: 'card-3',
    workspaceId: 'ws-personal',
    type: 'product',
    title: 'HAY Rey Chair in Umber Ochre',
    excerpt: 'Originally designed by Bruno Rey in 1971, featuring iconic screwless wood-to-metal connection joints and a rounded silhouette.',
    content: 'Originally designed by Swiss designer Bruno Rey in 1971, HAY has teamed up with Dietiker to relaunch the Rey Collection. Renowned for its screwless wood-to-metal connection, the iconic chair features an organic silhouette with angled legs that balance distinctly rounded edges. Stackable up to 4 chairs.',
    url: 'https://hay.dk/products/rey-chair-umber',
    domain: 'hay.dk',
    siteName: 'HAY Denmark',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1000&q=80',
    metadata: {
      product: {
        price: 495,
        currency: 'EUR',
        merchant: 'HAY',
        inStock: true,
        rating: 4.9,
        productUrl: 'https://hay.dk/products/rey-chair-umber'
      }
    },
    colorPalette: {
      dominant: '#db9938',
      vibrant: '#db9938',
      muted: '#8c7b6d',
      darkVariant: '#2b2318',
      lightVariant: '#faf4eb',
      hexPalette: ['#db9938', '#8c7b6d', '#2b2318', '#faf4eb', '#e5d9c7'],
      colorNames: ['warm ochre', 'mustard yellow', 'caramel bronze', 'deep charcoal']
    },
    tags: [
      { id: 't9', name: 'furniture', confidence: 0.98, source: 'meta_schema', reason: 'Identified chair category in HAY product catalog' },
      { id: 't10', name: 'product', confidence: 1.0, source: 'meta_schema', reason: 'Parsed price €495 and stock availability' },
      { id: 't11', name: 'warm ochre', confidence: 0.96, source: 'color_vision', reason: 'Vibrant yellow-ochre wood lacquer detected (#db9938)' },
      { id: 't12', name: 'bruno rey', confidence: 0.94, source: 'text_nlp', reason: 'Swiss modernist designer attribution' }
    ],
    detectedObjects: ['chair', 'wood', 'furniture', 'design object'],
    spaceIds: ['space-design', 'space-buy'],
    mindLinks: ['card-1', 'card-2'],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 'card-4',
    workspaceId: 'ws-personal',
    type: 'note',
    title: 'Notes on The Private Mind',
    excerpt: 'Thoughts on digital gardens, associative retrieval vs folder hierarchies, and bidirectional [[Mind Links]].',
    content: `Why folders fail:
Folders force you to decide what an idea is before you even understand it. A bookmark saved to "Reading List" is rarely read; a photo saved to "Inspiration" is buried under timestamps.

Instead, a true second mind should operate associatively:
- Color similarity brings back ideas through mood
- Auto-tagging connects [[The Architecture of Solitude]] with [[Dieter Rams on Honest Design]]
- Search should feel like asking your memory, not writing SQL.

## Next steps to explore:
- [x] Test client-side vector embeddings for instant offline Same Vibe
- [x] Build editable AI tag inspector so tags are never a black box
- [ ] Implement team workspaces without compromising private card sanctity`,
    colorPalette: {
      dominant: '#fffbeb',
      vibrant: '#d97706',
      muted: '#78716c',
      darkVariant: '#292524',
      lightVariant: '#fef3c7',
      hexPalette: ['#fffbeb', '#fef3c7', '#d97706', '#78716c', '#1c1917'],
      colorNames: ['warm ivory', 'mustard yellow']
    },
    tags: [
      { id: 't13', name: 'note', confidence: 1.0, source: 'meta_schema', reason: 'User freeform markdown note' },
      { id: 't14', name: 'pkm', confidence: 0.92, source: 'text_nlp', reason: 'Personal knowledge management and digital garden taxonomy' },
      { id: 't15', name: 'mind links', confidence: 0.96, source: 'text_nlp', reason: 'Contains [[ associative cross-references' }
    ],
    spaceIds: ['space-notes'],
    mindLinks: ['card-1', 'card-2'],
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 18
  },
  {
    id: 'card-5',
    workspaceId: 'ws-personal',
    type: 'book',
    title: 'Wabi-Sabi for Artists, Designers, Poets & Philosophers',
    excerpt: 'Leonard Koren’s seminal treatise on the Japanese beauty of things imperfect, impermanent, and incomplete.',
    content: 'Wabi-sabi is a beauty of things imperfect, impermanent, and incomplete. It is a beauty of things modest and humble. It is a beauty of things unconventional. Great simplicity is only possible after immense sophistication.',
    author: 'Leonard Koren',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    metadata: {
      book: {
        author: 'Leonard Koren',
        isbn: '978-1880656129',
        publisher: 'Imperfect Publishing',
        pageCount: 96,
        publishedYear: 1994
      }
    },
    colorPalette: {
      dominant: '#d8cfc4',
      vibrant: '#8c7b6d',
      muted: '#574c43',
      darkVariant: '#2e2621',
      lightVariant: '#faf8f5',
      hexPalette: ['#d8cfc4', '#8c7b6d', '#574c43', '#faf8f5', '#1a1918'],
      colorNames: ['warm ivory', 'caramel bronze', 'deep charcoal']
    },
    tags: [
      { id: 't16', name: 'book', confidence: 1.0, source: 'meta_schema', reason: 'Published monograph with ISBN and page metadata' },
      { id: 't17', name: 'wabi sabi', confidence: 0.99, source: 'text_nlp', reason: 'Seminal aesthetic philosophy topic match' },
      { id: 't18', name: 'japanese aesthetics', confidence: 0.95, source: 'text_nlp', reason: 'Cultural art theory classification' },
      { id: 't19', name: 'philosophy', confidence: 0.93, source: 'text_nlp', reason: 'Zen ontology and design epistemology' }
    ],
    detectedObjects: ['book cover', 'paper', 'monograph'],
    spaceIds: ['space-design', 'space-reading'],
    mindLinks: ['card-1', 'card-4'],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12
  },
  {
    id: 'card-6',
    workspaceId: 'ws-personal',
    type: 'todo',
    title: 'Design System Sprint Checklist',
    excerpt: '3 of 5 items completed for the Autumn refresh.',
    content: `- [x] Harmonize editorial font scale with Newsreader & Louize serifs
- [x] Calibrate warm parchment canvas tone (#fbfaf8) against OLED dark mode
- [x] Wire up bidirectional [[Mind Links]] graph resolver
- [ ] Add drag-and-drop spatial moodboard canvas layout
- [ ] Export client library as standalone JSON & Markdown zip archive`,
    metadata: {
      todo: {
        items: [
          { id: 'td1', text: 'Harmonize editorial font scale with Newsreader & Louize serifs', completed: true },
          { id: 'td2', text: 'Calibrate warm parchment canvas tone (#fbfaf8) against OLED dark mode', completed: true },
          { id: 'td3', text: 'Wire up bidirectional [[Mind Links]] graph resolver', completed: true },
          { id: 'td4', text: 'Add drag-and-drop spatial moodboard canvas layout', completed: false },
          { id: 'td5', text: 'Export client library as standalone JSON & Markdown zip archive', completed: false }
        ],
        progressPercent: 60
      }
    },
    colorPalette: {
      dominant: '#f0fdf4',
      vibrant: '#16a34a',
      muted: '#65a30d',
      darkVariant: '#14532d',
      lightVariant: '#dcfce7',
      hexPalette: ['#f0fdf4', '#dcfce7', '#16a34a', '#14532d', '#052e16'],
      colorNames: ['sage green', 'forest pine']
    },
    tags: [
      { id: 't20', name: 'todo', confidence: 1.0, source: 'meta_schema', reason: 'Contains markdown task checklist syntax' },
      { id: 't21', name: 'design system', confidence: 0.94, source: 'text_nlp', reason: 'Typography, palette, and component design tokens mentioned' },
      { id: 't22', name: 'sage green', confidence: 0.88, source: 'color_vision', reason: 'Completed task accent color theme' }
    ],
    spaceIds: ['space-notes'],
    mindLinks: ['card-4'],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    updatedAt: Date.now() - 1000 * 60 * 60 * 8
  },
  {
    id: 'card-7',
    workspaceId: 'ws-personal',
    type: 'image',
    title: 'Terracotta Coastline Architecture, Mallorca',
    excerpt: 'Organic curved stucco walls reflecting late afternoon Mediterranean sunlight.',
    content: 'Warm terracotta earthen stucco facades, arched porticos, and olive trees under balmy golden hour illumination in Deia, Mallorca.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    colorPalette: {
      dominant: '#d45b3a',
      vibrant: '#d45b3a',
      muted: '#db9938',
      darkVariant: '#2a1a12',
      lightVariant: '#faefe8',
      hexPalette: ['#d45b3a', '#db9938', '#faefe8', '#7c4a32', '#2a1a12'],
      colorNames: ['terracotta', 'warm ochre', 'caramel bronze']
    },
    tags: [
      { id: 't23', name: 'terracotta', confidence: 0.97, source: 'color_vision', reason: 'Dominant color #d45b3a extracted from earthen stucco' },
      { id: 't24', name: 'mallorca', confidence: 0.92, source: 'text_nlp', reason: 'Balearic architecture location match' },
      { id: 't25', name: 'architecture', confidence: 0.96, source: 'meta_schema', reason: 'Arched porticos and Mediterranean villas' },
      { id: 't26', name: 'warm ochre', confidence: 0.89, source: 'color_vision', reason: 'Secondary stone hue #db9938' }
    ],
    detectedObjects: ['building', 'terracotta wall', 'window', 'olive tree'],
    spaceIds: ['space-design'],
    mindLinks: ['card-1', 'card-3'],
    isFavorite: true,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: 'card-8',
    workspaceId: 'ws-personal',
    type: 'code',
    title: 'Reactive Cosine Similarity Heap (TypeScript)',
    excerpt: 'Sub-millisecond Top-K similarity ranker for client-side semantic retrieval.',
    content: `export function topKSimilar(
  targetVector: Float32Array, 
  candidates: { id: string; embedding: Float32Array }[], 
  k = 6
): string[] {
  const heap: { id: string; score: number }[] = [];
  
  for (let i = 0; i < candidates.length; i++) {
    const score = dotProduct(targetVector, candidates[i].embedding);
    if (heap.length < k) {
      heap.push({ id: candidates[i].id, score });
      heap.sort((a, b) => a.score - b.score);
    } else if (score > heap[0].score) {
      heap[0] = { id: candidates[i].id, score };
      heap.sort((a, b) => a.score - b.score);
    }
  }
  
  return heap.map(h => h.id).reverse();
}`,
    metadata: {
      code: {
        language: 'typescript',
        lineCount: 18
      }
    },
    colorPalette: {
      dominant: '#1e293b',
      vibrant: '#38bdf8',
      muted: '#64748b',
      darkVariant: '#0f172a',
      lightVariant: '#f1f5f9',
      hexPalette: ['#1e293b', '#38bdf8', '#64748b', '#0f172a', '#f1f5f9'],
      colorNames: ['midnight navy', 'electric cobalt', 'powder blue']
    },
    tags: [
      { id: 't27', name: 'code', confidence: 1.0, source: 'meta_schema', reason: 'Typescript syntax fence with typed parameters' },
      { id: 't28', name: 'algorithms', confidence: 0.96, source: 'text_nlp', reason: 'Min-heap top-k ranking routine' },
      { id: 't29', name: 'vector search', confidence: 0.94, source: 'text_nlp', reason: 'High-performance cosine similarity implementation' }
    ],
    spaceIds: ['space-notes'],
    mindLinks: ['card-4'],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2
  }
];

export const INITIAL_SPACES = [
  { id: 'space-all', name: 'Everything', slug: 'all', color: '#1a1a1a', isSmart: false, icon: 'Sparkles' },
  { id: 'space-design', name: 'Design & Living', slug: 'design', color: '#d45b3a', isSmart: true, filterQuery: 'tag:design || tag:architecture || type:image', icon: 'Palette' },
  { id: 'space-reading', name: 'Reading List', slug: 'reading', color: '#8f9f85', isSmart: true, filterQuery: 'type:article || type:book', icon: 'BookOpen' },
  { id: 'space-notes', name: 'Notes & Thoughts', slug: 'notes', color: '#db9938', isSmart: true, filterQuery: 'type:note || type:todo || type:quote', icon: 'FileText' },
  { id: 'space-buy', name: 'Buy Later', slug: 'buy', color: '#2463eb', isSmart: true, filterQuery: 'type:product', icon: 'ShoppingBag' }
];
