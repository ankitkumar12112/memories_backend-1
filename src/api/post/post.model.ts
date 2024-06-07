import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const Post = z.object({
  firstname: z.any(),
  lastname: z.any(),
  image: z.any().optional(),
  file :z.any().optional(),
  title: z.any(),
  description: z.any().optional(),
    
});

export type Post = z.infer<typeof Post>;
export type PostWithId = WithId<Post>;
export const Posts = db.collection<Post>('Post');