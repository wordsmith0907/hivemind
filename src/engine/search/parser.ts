import { Token, TokenType, ASTNode, ChainedTokenPill, FilterField } from '../../types/search';
import { SearchLexer } from './lexer';
import {
  createLogicalNode,
  createNotNode,
  createTextNode,
  createExactPhraseNode,
  createFilterNode,
  createVibeSemanticNode
} from './ast';

export class SearchParser {
  private tokens: Token[] = [];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public static parse(query: string, pills: ChainedTokenPill[] = []): ASTNode | null {
    let queryAst: ASTNode | null = null;

    if (query.trim().length > 0) {
      const lexer = new SearchLexer(query);
      const tokens = lexer.tokenize();
      const parser = new SearchParser(tokens);
      queryAst = parser.parseExpression();
    }

    // Convert chained pills into AST nodes
    const pillNodes: ASTNode[] = pills.map((pill) => {
      let node: ASTNode;
      if (pill.field && pill.field !== 'keyword' && pill.field !== 'vibe') {
        node = createFilterNode(pill.field as FilterField, pill.value);
      } else if (pill.field === 'vibe') {
        node = createVibeSemanticNode(pill.value);
      } else {
        node = createTextNode(pill.value);
      }

      if (pill.isNegated) {
        node = createNotNode(node);
      }
      return node;
    });

    if (pillNodes.length === 0) {
      return queryAst;
    }

    // Join all pill nodes with AND
    let combinedPills = pillNodes[0];
    for (let i = 1; i < pillNodes.length; i++) {
      combinedPills = createLogicalNode('AND', combinedPills, pillNodes[i]);
    }

    if (!queryAst) {
      return combinedPills;
    }

    return createLogicalNode('AND', combinedPills, queryAst);
  }

  public parseExpression(): ASTNode | null {
    if (this.isAtEnd()) return null;
    return this.parseOr();
  }

  // Precedence 1: OR ("||" or "OR")
  private parseOr(): ASTNode {
    let expr = this.parseAnd();

    while (this.match(TokenType.OR)) {
      const right = this.parseAnd();
      expr = createLogicalNode('OR', expr, right);
    }

    return expr;
  }

  // Precedence 2: AND ("&&" or "AND" or implicit whitespace juxtaposition)
  private parseAnd(): ASTNode {
    let expr = this.parseUnary();

    while (
      this.match(TokenType.AND) ||
      (!this.isAtEnd() && this.peek().type !== TokenType.OR && this.peek().type !== TokenType.RPAREN)
    ) {
      // If there was no explicit AND token, it's implicit whitespace juxtaposition
      if (this.previous()?.type !== TokenType.AND && !this.check(TokenType.AND)) {
        // Just continue to next unary expression
      }
      const right = this.parseUnary();
      expr = createLogicalNode('AND', expr, right);
    }

    return expr;
  }

  // Precedence 3: NOT ("-" or "!" or "NOT")
  private parseUnary(): ASTNode {
    if (this.match(TokenType.NOT)) {
      const child = this.parseUnary();
      return createNotNode(child);
    }

    return this.parsePrimary();
  }

  // Precedence 4: Primary expressions
  private parsePrimary(): ASTNode {
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseOr();
      this.consume(TokenType.RPAREN, "Expected ')' after grouped expression.");
      return expr;
    }

    if (this.match(TokenType.EXACT_PHRASE)) {
      return createExactPhraseNode(this.previous().value);
    }

    if (this.match(TokenType.VIBE)) {
      return createVibeSemanticNode(this.previous().value);
    }

    if (
      this.match(
        TokenType.TYPE,
        TokenType.FORMAT,
        TokenType.SITE,
        TokenType.TAG,
        TokenType.COLOR,
        TokenType.OBJECT,
        TokenType.OCR_TEXT,
        TokenType.ACTION,
        TokenType.COMPLETED
      )
    ) {
      const token = this.previous();
      const field = (token.field || token.type.toLowerCase()) as FilterField;
      return createFilterNode(field, token.value);
    }

    if (this.match(TokenType.TEXT)) {
      return createTextNode(this.previous().value);
    }

    // Fallback for unexpected token
    const token = this.advance();
    return createTextNode(token.value || token.raw);
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: TokenType.EOF, value: '', raw: '', start: 0, end: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`Parse error at token ${this.peek().raw}: ${message}`);
  }
}
