import { Router } from 'express';
import UserController from '../controllers/UserController';

const userRoute = Router();

userRoute.get('/profile/:username', UserController.profile);
userRoute.put('/profile', UserController.editProfile);

export default userRoute;
