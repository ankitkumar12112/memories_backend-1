import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const Auth = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  password: z.string(),
  
});

export type Auth = z.infer<typeof Auth>;
export type AuthWithId = WithId<Auth>;
export const Auths = db.collection<Auth>('Auth');