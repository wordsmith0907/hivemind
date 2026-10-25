import { Token, TokenType, FilterField } from '../../types/search';

const FILTER_FIELDS: Set<string> = new Set([
  'type',
  'format',
  'site',
  'tag',
  'color',
  'object',
  'text',
  'action',
  'completed',
  'vibe'
]);

export class SearchLexer {
  private input: string;
  private pos: number = 0;
  private len: number;

  constructor(input: string) {
    this.input = input.trim();
    this.len = this.input.length;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    // Check for leading semantic query "|| <vibe>"
    if (this.input.startsWith('|| ') || this.input.startsWith('||')) {
      const vibeText = this.input.replace(/^\|\|\s*/, '').trim();
      if (vibeText.length > 0) {
        tokens.push({
          type: TokenType.VIBE,
          value: vibeText,
          raw: this.input,
          start: 0,
          end: this.len
        });
        tokens.push({
          type: TokenType.EOF,
          value: '',
          raw: '',
          start: this.len,
          end: this.len
        });
        return tokens;
      }
    }

    while (this.pos < this.len) {
      this.skipWhitespace();
      if (this.pos >= this.len) break;

      const char = this.input[this.pos];

      // Parentheses
      if (char === '(') {
        tokens.push(this.makeToken(TokenType.LPAREN, '(', 1));
        continue;
      }
      if (char === ')') {
        tokens.push(this.makeToken(TokenType.RPAREN, ')', 1));
        continue;
      }

      // Boolean AND: "&&"
      if (this.input.startsWith('&&', this.pos)) {
        tokens.push(this.makeToken(TokenType.AND, '&&', 2));
        continue;
      }

      // Boolean OR: "||"
      if (this.input.startsWith('||', this.pos)) {
        tokens.push(this.makeToken(TokenType.OR, '||', 2));
        continue;
      }

      // Negation: "-" or "!"
      if ((char === '-' || char === '!') && this.pos + 1 < this.len && !this.isWhitespace(this.input[this.pos + 1])) {
        tokens.push(this.makeToken(TokenType.NOT, char, 1));
        continue;
      }

      // Exact phrase: "..."
      if (char === '"' || char === "'") {
        const quoteToken = this.consumeQuotedString(char);
        if (quoteToken) {
          tokens.push(quoteToken);
          continue;
        }
      }

      // Hashtag: #tag
      if (char === '#') {
        const tagToken = this.consumeHashtag();
        if (tagToken) {
          tokens.push(tagToken);
          continue;
        }
      }

      // Read unquoted word / prefix
      const wordToken = this.consumeWordOrFilter();
      if (wordToken) {
        tokens.push(wordToken);
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: '',
      raw: '',
      start: this.len,
      end: this.len
    });

    return tokens;
  }

  private skipWhitespace(): void {
    while (this.pos < this.len && this.isWhitespace(this.input[this.pos])) {
      this.pos++;
    }
  }

  private isWhitespace(ch: string): boolean {
    return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
  }

  private makeToken(type: TokenType, value: string, length: number): Token {
    const start = this.pos;
    this.pos += length;
    return {
      type,
      value,
      raw: value,
      start,
      end: this.pos
    };
  }

  private consumeQuotedString(quoteChar: string): Token | null {
    const start = this.pos;
    this.pos++; // skip open quote
    let value = '';
    while (this.pos < this.len && this.input[this.pos] !== quoteChar) {
      if (this.input[this.pos] === '\\' && this.pos + 1 < this.len) {
        this.pos++;
        value += this.input[this.pos];
      } else {
        value += this.input[this.pos];
      }
      this.pos++;
    }

    if (this.pos < this.len && this.input[this.pos] === quoteChar) {
      this.pos++; // skip close quote
    }

    return {
      type: TokenType.EXACT_PHRASE,
      value: value.trim(),
      raw: this.input.substring(start, this.pos),
      start,
      end: this.pos
    };
  }

  private consumeHashtag(): Token | null {
    const start = this.pos;
    this.pos++; // skip '#'
    let tag = '';
    while (this.pos < this.len && /[a-zA-Z0-9_\-\/]/.test(this.input[this.pos])) {
      tag += this.input[this.pos];
      this.pos++;
    }

    if (tag.length === 0) return null;

    return {
      type: TokenType.TAG,
      field: 'tag',
      value: tag.toLowerCase(),
      raw: this.input.substring(start, this.pos),
      start,
      end: this.pos
    };
  }

  private consumeWordOrFilter(): Token | null {
    const start = this.pos;
    let text = '';

    while (
      this.pos < this.len &&
      !this.isWhitespace(this.input[this.pos]) &&
      this.input[this.pos] !== '(' &&
      this.input[this.pos] !== ')'
    ) {
      text += this.input[this.pos];
      this.pos++;
    }

    if (text.length === 0) return null;

    // Check for logical keywords
    const upper = text.toUpperCase();
    if (upper === 'AND') {
      return { type: TokenType.AND, value: 'AND', raw: text, start, end: this.pos };
    }
    if (upper === 'OR') {
      return { type: TokenType.OR, value: 'OR', raw: text, start, end: this.pos };
    }
    if (upper === 'NOT') {
      return { type: TokenType.NOT, value: 'NOT', raw: text, start, end: this.pos };
    }

    // Check for field:value pattern
    const colonIdx = text.indexOf(':');
    if (colonIdx > 0) {
      const field = text.substring(0, colonIdx).toLowerCase();
      let value = text.substring(colonIdx + 1);

      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      if (FILTER_FIELDS.has(field)) {
        if (field === 'vibe') {
          return {
            type: TokenType.VIBE,
            value,
            raw: text,
            start,
            end: this.pos
          };
        }

        const tokenTypeMap: Record<string, TokenType> = {
          type: TokenType.TYPE,
          format: TokenType.FORMAT,
          site: TokenType.SITE,
          tag: TokenType.TAG,
          color: TokenType.COLOR,
          object: TokenType.OBJECT,
          text: TokenType.OCR_TEXT,
          action: TokenType.ACTION,
          completed: TokenType.COMPLETED
        };

        return {
          type: tokenTypeMap[field] || TokenType.TEXT,
          field: field as FilterField,
          value,
          raw: text,
          start,
          end: this.pos
        };
      }
    }

    return {
      type: TokenType.TEXT,
      value: text,
      raw: text,
      start,
      end: this.pos
    };
  }
}
