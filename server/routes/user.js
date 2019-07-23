import { Router } from 'express';
import UserController from '../controllers/user';

const userRoute = Router();

userRoute.get('/profile/:username', UserController.profile);
userRoute.put('/profile', UserController.editProfile);

export default userRoute;
