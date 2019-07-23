import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/User';

config();

class Auth {
  static async authenticate(req, res, next) {
    try {
      const token = req.header('Authorization').replace('Bearer', '').trim();
      const decoded = jwt.verify(token, process.env.SECRET);
      // eslint-disable-next-line no-underscore-dangle
      const user = await User.findOne({ _id: decoded._id });

      if (!user) {
        res.status(400).json({ message: 'User not found.' });
      }
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Please authenticate!' });
    }
  }
}

export default Auth;
