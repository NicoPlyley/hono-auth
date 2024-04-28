import { createMiddleware } from 'hono/factory';
import { ZodSchema } from 'zod';
import { ErrorResponse } from 'hono-error-handler';

const validate = (schema: ZodSchema) =>
  createMiddleware(async (c, next) => {
    const data = await c.req.json();

    const result = schema.safeParse(data);

    if (!result.success) {
      let message = '';
      result.error.issues.forEach((issue) => {
        message += issue.message + '. ';
      });

      throw new ErrorResponse(message, 400);
    }

    await next();
  });

export default validate;
