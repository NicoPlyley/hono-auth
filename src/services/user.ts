import { DrizzleD1Database } from 'drizzle-orm/d1';
import { ErrorResponse } from 'hono-error-handler';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (
  enteredPassword: string,
  userPassword: string
) => {
  return bcrypt.compare(enteredPassword, userPassword);
};

const generateToken = async (id: number, jwtSecret: string) => {
  const encoder = new TextEncoder();
  const secret = encoder.encode(jwtSecret);
  const payload = {
    sub: id.toString(),
  };

  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(secret);
};

export const login = async (
  db: DrizzleD1Database,
  data: Login,
  jwtSecret: string
) => {
  let { username, password } = data;

  username = username.toLowerCase();

  let user = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.username, username));

  if (!user) {
    throw new ErrorResponse('Invalid username or password', 401);
  }

  const validatePassword = await verifyPassword(password, user[0].password);

  if (!validatePassword) {
    throw new ErrorResponse('Invalid username or password', 401);
  }

  return generateToken(user[0].id, jwtSecret);
};

export const create = async (db: DrizzleD1Database, data: User) => {
  let { name, username, password } = data;

  const hashedPassword = await hashPassword(password);

  const user = {
    name,
    username: username?.toLowerCase(),
    password: hashedPassword,
  };

  const newUser = await db
    .insert(users)
    .values(user)
    .returning({ name: users.name, username: users.username });

  return newUser[0];
};
