import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as Auths from './auth.handlers';
import { Auth } from './auth.model';

const router = Router();

router.get('/', Auths.findAll);
router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  Auths.findOne,
);
router.post(
  '/',
  validateRequest({
    body: Auth,
  }),
  Auths.createOne,
);
router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Auth,
  }),
  Auths.updateOne,
);
// keep the order for "router"
router.delete(
  '/deleteall',
  Auths.deleteAll,
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  Auths.deleteOne,
);


export default router;