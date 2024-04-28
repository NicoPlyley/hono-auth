import { createMiddleware } from 'hono/factory';
import { ErrorResponse } from 'hono-error-handler';
import * as jose from 'jose';
import * as User from '../services/user';

type Bindings = {
  JWT_SECRET: string;
};

const protect = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const db = c.get('db');
  const jwt = c.req.header('Authorization');

  if (!jwt || !jwt.startsWith('Bearer ')) {
    throw new ErrorResponse('Not authorized 1', 401);
  }

  const token = jwt.split(' ')[1];

  const encoder = new TextEncoder();
  const secret = encoder.encode(c.env.JWT_SECRET);

  let user;

  try {
    const { payload } = await jose.jwtVerify(token, secret);

    let { sub } = payload;

    if (!sub) {
      throw new ErrorResponse('Not authorized', 401);
    }

    const id = parseInt(sub);

    user = await User.getMe(db, id);
  } catch (error) {
    throw new ErrorResponse('Not authorized', 401);
  }

  if (!user) {
    throw new ErrorResponse('Not authorized', 401);
  }

  c.set('user', user);

  await next();
});

export default protect;
