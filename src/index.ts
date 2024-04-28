import { Hono } from 'hono';
import { errorHandler } from 'hono-error-handler';
import { connectD1 } from './middleware';
import { StatusCode } from 'hono/utils/http-status';
import errorHandlers from './errors';

const app = new Hono();

app.use(connectD1);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.onError(
  errorHandler(errorHandlers, (err, c) => {
    // console.log(err);
    return c.json(
      {
        success: false,
        message: err.message || 'Internal server error',
      },
      (err.statusCode as StatusCode) || 500
    );
  })
);

export default app;
