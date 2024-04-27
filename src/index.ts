import { Hono } from 'hono';
import { errorHandler } from 'hono-error-handler';
import { connectD1 } from './middleware';

const app = new Hono();

app.use(connectD1);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.onError(
  errorHandler([], (error, c) => {
    return c.json({
      success: false,
      error: error.message,
    });
  })
);

export default app;
