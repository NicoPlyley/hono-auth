import { z } from 'zod';

export const userModel = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
});

export const loginModel = z.object({
  username: z.string(),
  password: z.string(),
});
