import { SearchParser } from './parser';
import { QueryCompiler, CompiledQuery } from './compiler';
import { ASTNode, ChainedTokenPill } from '../../types/search';
import { Card } from '../../types/card';

export interface SearchExecutionResult {
  matchingCards: Card[];
  totalMatches: number;
  semanticQuery?: string;
  hasFilter: boolean;
}

export class SearchEngine {
  public static execute(
    cards: Card[],
    query: string,
    pills: ChainedTokenPill[] = []
  ): SearchExecutionResult {
    const ast: ASTNode | null = SearchParser.parse(query, pills);
    const compiled: CompiledQuery = QueryCompiler.compile(ast);

    if (!compiled.hasFilter) {
      return {
        matchingCards: cards,
        totalMatches: cards.length,
        hasFilter: false
      };
    }

    const matchingCards = cards.filter(compiled.inMemoryPredicate);

    return {
      matchingCards,
      totalMatches: matchingCards.length,
      semanticQuery: compiled.semanticQuery,
      hasFilter: true
    };
  }
}

export { SearchParser } from './parser';
export { SearchLexer } from './lexer';
export { QueryCompiler } from './compiler';
export * from './ast';
