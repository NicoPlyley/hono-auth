import { DrizzleD1Database } from 'drizzle-orm/d1';

declare module 'hono' {
  interface ContextVariableMap {
    db: DrizzleD1Database;
  }
}

declare global {
  interface Login {
    username: string;
    password: string;
  }

  interface User {
    id?: number;
    name: string;
    username: string;
    password: string;
  }
}

export {};
