import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set('db', db);

  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default app;
