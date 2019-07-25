import { Router } from 'express';
import UserController from '../controllers/UserController';

const authRoute = Router();

authRoute.post('/signup', UserController.signup);
authRoute.post('/login', UserController.login);

export default authRoute;
