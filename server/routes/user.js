import { Router } from 'express';
import UserController from '../controllers/UserController';
import Auth from '../middleware/auth';

const userRoute = Router();

userRoute.get('/profile/:username', Auth.authenticate, UserController.profile);
userRoute.put('/profile', Auth.authenticate, UserController.editProfile);
userRoute.post('/:username/follow', Auth.authenticate, UserController.follow);
userRoute.post('/:username/unfollow', Auth.authenticate, UserController.unfollow);

export default userRoute;
