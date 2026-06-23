import { vi } from 'vitest';

type QueryResultRow = Record<string, unknown>;

interface QueryResult<T extends QueryResultRow = any> {
  rows: T[];
  rowCount: number;
}

type QueryHandler = (text: string, params?: any[]) => QueryResult | Promise<QueryResult>;

export class MockPool {
  private handler: QueryHandler;

  constructor() {
    // Default handler: return empty results for everything
    this.handler = () => ({ rows: [], rowCount: 0 });
  }

  setHandler(handler: QueryHandler) {
    this.handler = handler;
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    const result = await this.handler(text, params);
    return result as QueryResult<T>;
  }

  // Transaction stub — executes fn immediately with a proxy client
  async transaction<T>(fn: (client: { query: MockPool['query'] }) => Promise<T>): Promise<T> {
    return fn({ query: this.query.bind(this) });
  }
}

// Helper: build a handler that matches SQL patterns
export function matchHandler(
  rules: Array<{
    match: RegExp | string;
    handler: (text: string, params?: any[]) => QueryResult | Promise<QueryResult>;
  }>,
): QueryHandler {
  return (text: string, params?: any[]) => {
    for (const rule of rules) {
      if (typeof rule.match === 'string') {
        if (text.trim().startsWith(rule.match)) {
          return rule.handler(text, params);
        }
      } else {
        if (rule.match.test(text)) {
          return rule.handler(text, params);
        }
      }
    }
    return { rows: [], rowCount: 0 };
  };
}
