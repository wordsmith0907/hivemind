/**
 * Mymind Search Engine & AST Type Definitions
 */

export enum TokenType {
  TEXT = 'TEXT',                     // Free keyword
  EXACT_PHRASE = 'EXACT_PHRASE',     // Quoted string "..."
  TAG = 'TAG',                       // #tag or tag:value
  TYPE = 'TYPE',                     // type:article
  FORMAT = 'FORMAT',                 // format:pdf
  SITE = 'SITE',                     // site:youtube.com
  COLOR = 'COLOR',                   // color:orange or color:#ff6600
  OBJECT = 'OBJECT',                 // object:chair
  OCR_TEXT = 'OCR_TEXT',             // text:checkout
  ACTION = 'ACTION',                 // action:read
  COMPLETED = 'COMPLETED',           // completed:true | false
  VIBE = 'VIBE',                     // vibe:... or || ...
  AND = 'AND',                       // && or AND
  OR = 'OR',                         // || or OR
  NOT = 'NOT',                       // - or ! or NOT
  LPAREN = 'LPAREN',                 // (
  RPAREN = 'RPAREN',                 // )
  CHAINED_PILL = 'CHAINED_PILL',     // Token pill committed via Enter
  EOF = 'EOF'
}

export interface Token {
  type: TokenType;
  value: string;
  field?: string;
  raw: string;
  start: number;
  end: number;
}

export type ASTNodeType =
  | 'LOGICAL'
  | 'NOT'
  | 'TEXT'
  | 'EXACT_PHRASE'
  | 'FILTER'
  | 'VIBE_SEMANTIC';

export interface LogicalNode {
  type: 'LOGICAL';
  operator: 'AND' | 'OR';
  left: ASTNode;
  right: ASTNode;
}

export interface NotNode {
  type: 'NOT';
  child: ASTNode;
}

export interface TextNode {
  type: 'TEXT';
  value: string;
  isFuzzy?: boolean;
}

export interface ExactPhraseNode {
  type: 'EXACT_PHRASE';
  phrase: string;
}

export type FilterField =
  | 'type'
  | 'format'
  | 'site'
  | 'tag'
  | 'color'
  | 'object'
  | 'text'
  | 'action'
  | 'completed';

export interface FilterNode {
  type: 'FILTER';
  field: FilterField;
  value: string;
}

export interface VibeSemanticNode {
  type: 'VIBE_SEMANTIC';
  query: string;
  minScoreThreshold: number; // default 0.65
}

export type ASTNode =
  | LogicalNode
  | NotNode
  | TextNode
  | ExactPhraseNode
  | FilterNode
  | VibeSemanticNode;

export interface ChainedTokenPill {
  id: string;
  label: string;
  field?: FilterField | 'keyword' | 'vibe';
  value: string;
  isNegated?: boolean;
}

export interface SearchState {
  rawInput: string;
  pills: ChainedTokenPill[];
  ast: ASTNode | null;
  activeTypeFilter?: string;
}

export interface SearchResultItem {
  cardId: string;
  relevanceScore: number;
  semanticSimilarity?: number;
  highlightedSnippets?: {
    field: string;
    snippet: string;
  }[];
}
