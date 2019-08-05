import { Router } from 'express';
import Response from '../util/Response';
import authRoute from './auth';
import userRoute from './user';
import articleRoute from './article';

const router = Router();

router.get('/', (req, res) => {
  Response.success(res, 200, 'Welcome to the API');
});

router.use('/auth', authRoute);
router.use('/', userRoute);
router.use('/', articleRoute);

export default router;
