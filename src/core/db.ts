import Dexie, { Table } from 'dexie';
import { Card } from '../types/card';
import { Tag } from '../types/tag';
import { Space } from '../types/space';
import { Workspace, Comment, ActivityLog } from '../types/workspace';
import { MindLink } from '../types/mindlink';

export class HivemindDatabase extends Dexie {
  cards!: Table<Card, string>;
  tags!: Table<Tag, string>;
  spaces!: Table<Space, string>;
  workspaces!: Table<Workspace, string>;
  comments!: Table<Comment, string>;
  activityLogs!: Table<ActivityLog, string>;
  mindLinks!: Table<MindLink, string>;

  constructor() {
    super('HivemindAppDB');

    this.version(1).stores({
      cards: 'id, workspaceId, type, domain, isFavorite, isPinned, isArchived, isDeleted, createdAt, updatedAt, *spaceIds, *mindLinks, *tags.name, *colorPalette.colorNames',
      tags: 'id, name, slug, cardCount, isUserCreated',
      spaces: 'id, workspaceId, slug, isSmart, createdAt',
      workspaces: 'id, slug, isPersonal, createdAt',
      comments: 'id, workspaceId, cardId, authorId, createdAt',
      activityLogs: 'id, workspaceId, cardId, timestamp',
      mindLinks: 'id, workspaceId, sourceCardId, targetCardId, [sourceCardId+targetCardId]'
    });
  }
}

export const db = new HivemindDatabase();
export { HivemindDatabase as MymindDatabase };
