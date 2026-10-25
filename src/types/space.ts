/**
 * Mymind Space & SmartSpace Schema
 */

export interface CanvasPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
}

export interface Space {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;                // Lucide icon name or emoji
  color?: string;               // Accent color hex
  isSmart: boolean;             // True if driven by dynamic search query
  filterQuery?: string;         // e.g. "type:article && #architecture"
  cardIds?: string[];           // Explicit card IDs if manual collection
  canvasPositions?: Record<string, CanvasPosition>;
  createdAt: number;
  updatedAt: number;
}
