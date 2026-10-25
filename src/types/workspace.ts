/**
 * Mymind Workspace, Comment & Activity Schema
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  avatarUrl?: string;
  isPersonal: boolean;
  memberCount: number;
  currentUserRole: 'owner' | 'editor' | 'viewer';
  createdAt: number;
}

export interface Comment {
  id: string;
  workspaceId: string;
  cardId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  cardId: string;
  actor: string;
  action: 'created' | 'tagged' | 'edited' | 'linked' | 'archived' | 'restored' | 'deleted';
  timestamp: number;
  payload?: Record<string, any>;
}
