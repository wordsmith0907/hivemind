export * from '../../types/search';
import {
  ASTNode,
  LogicalNode,
  NotNode,
  TextNode,
  ExactPhraseNode,
  FilterNode,
  VibeSemanticNode,
  FilterField
} from '../../types/search';

export function createLogicalNode(operator: 'AND' | 'OR', left: ASTNode, right: ASTNode): LogicalNode {
  return {
    type: 'LOGICAL',
    operator,
    left,
    right
  };
}

export function createNotNode(child: ASTNode): NotNode {
  return {
    type: 'NOT',
    child
  };
}

export function createTextNode(value: string, isFuzzy = false): TextNode {
  return {
    type: 'TEXT',
    value,
    isFuzzy
  };
}

export function createExactPhraseNode(phrase: string): ExactPhraseNode {
  return {
    type: 'EXACT_PHRASE',
    phrase
  };
}

export function createFilterNode(field: FilterField, value: string): FilterNode {
  return {
    type: 'FILTER',
    field,
    value
  };
}

export function createVibeSemanticNode(query: string, minScoreThreshold = 0.65): VibeSemanticNode {
  return {
    type: 'VIBE_SEMANTIC',
    query,
    minScoreThreshold
  };
}
