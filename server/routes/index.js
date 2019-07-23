import { Router } from 'express';
import authRoute from './auth';
import userRoute from './user';

const router = Router();

router.get('/', (req, res) => res.status(200).json({ status: 'success', message: 'Welcome to the API' }));

router.use('/auth', authRoute);
router.use('/', userRoute);

export default router;
