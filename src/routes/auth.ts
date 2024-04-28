import { Hono } from 'hono';
import * as User from '../services/user';
import { loginModel, userModel } from '../models';
import { protect, validate } from '../middleware';

type Bindings = {
  JWT_SECRET: string;
};

const auth = new Hono<{ Bindings: Bindings }>();

// @desc   Login
// @route  POST /auth/login
// @method Public
auth.post('/login', validate(loginModel), async (c) => {
  let data = await c.req.json();
  const db = c.get('db');

  const token = await User.login(db, data, c.env.JWT_SECRET);

  return c.json({
    success: true,
    token: token,
  });
});

// @desc   Create account
// @route  POST /auth/register
// @method Public
auth.post('/register', validate(userModel), async (c) => {
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

// @desc   Get current user
// @route  POST /auth/me
// @method Private
auth.get('/me', protect, (c) => {
  const user = c.get('user');
  return c.json({
    success: true,
    data: user,
  });
});

export default auth;
