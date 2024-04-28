import { z } from 'zod';

export const userModel = z.object({
  name: z.string({ message: 'Name is required' }),
  username: z
    .string({ message: 'Username is required' })
    .min(4, 'Username must contain at least 4 character')
    .max(50, 'User must contain less than 50 character'),
  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must contain at least 6 character'),
});

export const loginModel = z.object({
  username: z.string({ message: 'Username is required' }),
  password: z.string({ message: 'Password is required' }),
});
