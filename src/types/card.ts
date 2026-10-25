/**
 * Mymind Card & Content Entity Schema
 */

export type CardType =
  | 'note'
  | 'article'
  | 'image'
  | 'quote'
  | 'product'
  | 'book'
  | 'todo'
  | 'code'
  | 'video'
  | 'audio'
  | 'pdf';

export interface ColorPalette {
  dominant: string;       // Hex: e.g. '#2b4c3f'
  vibrant: string;        // Hex: e.g. '#e05a47'
  muted: string;          // Hex: e.g. '#d8cfc4'
  darkVariant: string;    // Contrast color for light text
  lightVariant: string;   // Contrast color for dark text
  hexPalette: string[];   // Top 5 hex colors
  colorNames: string[];   // e.g. ['terracotta', 'forest green', 'warm ochre']
}

export interface CardTag {
  id: string;
  name: string;
  confidence: number;     // 0.00 to 1.00
  source: 'color_vision' | 'url_domain' | 'meta_schema' | 'text_nlp' | 'ocr' | 'user';
  reason: string;         // "Why this tag?" explanation
  isUserAdded?: boolean;
}

export interface ProductMetadata {
  price?: number;
  currency?: string;      // 'USD', 'EUR', etc.
  merchant?: string;
  inStock?: boolean;
  rating?: number;
  productUrl?: string;
}

export interface BookMetadata {
  author?: string;
  isbn?: string;
  publisher?: string;
  pageCount?: number;
  publishedYear?: number;
}

export interface QuoteMetadata {
  author?: string;
  sourceTitle?: string;
  context?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoMetadata {
  items: TodoItem[];
  progressPercent: number;
}

export interface VideoMetadata {
  durationSeconds?: number;
  embedUrl?: string;
  channelTitle?: string;
  platform?: 'youtube' | 'vimeo' | 'tiktok' | 'other';
}

export interface AudioMetadata {
  durationSeconds?: number;
  transcriptSnippet?: string;
  artist?: string;
}

export interface CodeMetadata {
  language: string;
  lineCount: number;
}

export interface CardMetadata {
  product?: ProductMetadata;
  book?: BookMetadata;
  quote?: QuoteMetadata;
  todo?: TodoMetadata;
  video?: VideoMetadata;
  audio?: AudioMetadata;
  code?: CodeMetadata;
  custom?: Record<string, any>;
}

export interface Card {
  id: string;
  workspaceId: string;
  type: CardType;
  title: string;
  content: string;              // Full text or Markdown content
  excerpt: string;              // 1-2 sentence synopsis
  url?: string;
  domain?: string;              // e.g. 'github.com', 'archdaily.com'
  siteName?: string;
  author?: string;
  publishedAt?: string;

  // Media & Visuals
  thumbnailUrl?: string;
  mediaUrls?: string[];
  colorPalette?: ColorPalette;

  // Metrics
  readingTimeMinutes?: number;
  wordCount?: number;

  // AI Enrichment
  tags: CardTag[];
  detectedObjects?: string[];   // Vision detected objects: ['chair', 'table']
  ocrText?: string;             // Text detected within image
  embedding?: Float32Array;     // 128D or 384D normalized vector

  // Specialized Metadata
  metadata?: CardMetadata;

  // Organization & Knowledge Graph
  spaceIds: string[];           // Assigned spaces
  mindLinks: string[];          // Target card IDs explicitly linked via [[Card Name]]

  // Flags & Timestamps
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: number;            // Epoch timestamp ms
  updatedAt: number;
  archivedAt?: number;
  deletedAt?: number;
}
