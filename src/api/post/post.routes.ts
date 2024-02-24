import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as Posts from './post.handlers';
import { Post } from './post.model';

const router = Router();

router.get('/', Posts.findAll);
router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  Posts.findOne,
);
router.post(
  '/',
  validateRequest({
    body: Post,
  }),
  Posts.createOne,
);
router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Post,
  }),
  Posts.updateOne,
);
// keep the order for "router"
router.delete(
  '/deleteall',
  Posts.deleteAll,
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  Posts.deleteOne,
);


export default router;