import { Hono } from 'hono';
import * as User from '../services/user';
import { zValidator } from '@hono/zod-validator';
import { loginModel, userModel } from '../models';
import { protect } from '../middleware';

type Bindings = {
  JWT_SECRET: string;
};

const auth = new Hono<{ Bindings: Bindings }>();

auth.post('/login', zValidator('json', loginModel), async (c) => {
  let data = await c.req.json();
  const db = c.get('db');

  const token = await User.login(db, data, c.env.JWT_SECRET);

  return c.json({
    success: true,
    token: token,
  });
});

auth.post('/register', zValidator('json', userModel), async (c) => {
  const data = await c.req.json();
  const db = c.get('db');

  const newUser = await User.create(db, data);

  return c.json(
    {
      success: true,
      data: newUser,
    },
    201
  );
});

auth.get('/me', protect, (c) => {
  const user = c.get('user');
  return c.json({
    success: true,
    data: user,
  });
});

export default auth;
