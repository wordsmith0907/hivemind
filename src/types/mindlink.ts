/**
 * Mymind MindLink Schema (Bi-directional associative graph)
 */

export interface MindLink {
  id: string;
  workspaceId: string;
  sourceCardId: string;
  targetCardId: string;
  linkText: string;             // Anchor label from [[Label]]
  contextSnippet?: string;      // Sentence context containing the link
  createdAt: number;
}

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  color?: string;
  linkCount: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface MindGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
