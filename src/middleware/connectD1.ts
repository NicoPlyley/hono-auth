import { createMiddleware } from 'hono/factory';
import { drizzle } from 'drizzle-orm/d1';

type Bindings = {
  DB: D1Database;
};

const connectD1 = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set('db', db);

  await next();
});

export default connectD1;
