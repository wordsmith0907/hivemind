/**
 * Mymind Tag & Visible AI Reasoning Types
 */

export interface Tag {
  id: string;
  name: string;
  slug: string;
  cardCount: number;
  isUserCreated: boolean;
  suggestedColor?: string;
  createdAt: number;
}

export interface VisibleAIExplanation {
  tag: string;
  confidence: number;
  source: 'color_vision' | 'url_domain' | 'meta_schema' | 'text_nlp' | 'ocr' | 'user';
  reason: string;
}
