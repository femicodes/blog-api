/* eslint-disable no-underscore-dangle */
import User from '../models/User';
import Response from '../util/Response';
import { validateSignup, validateLogin } from '../validations/auth';
/**
 * @class AuthController
 * @description specifies which method handles a request for Auth endpoints
 * @exports AuthController
 */
class AuthController {
  /**
   * @method signup
   * @description Registers a user if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @return {json} Returns json object
   */
  static async signup(req, res) {
    try {
      const { error } = validateSignup(req.body);
      if (error) return Response.error(res, 400, error.details[0].message);

      const {
        email, password,
      } = req.body;
      let { username } = req.body;
      username = username.replace(/\s/g, '');

      const newUser = new User({
        username, email, password,
      });
      const checkUser = await User.findOne({ email });
      if (checkUser) return Response.error(res, 403, 'Email already in use.');

      const checkUsername = await User.findOne({ username });
      if (checkUsername) return Response.error(res, 403, 'User already taken.');

      const user = await newUser.save();
      const token = await newUser.generateToken();
      const data = {
        token,
        username: user.username,
        email: user.email,
      };
      return Response.success(res, 201, data, 'Account created!');
    } catch (err) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
   * @method login
   * @description Logs in a registered user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @return {json} Returns json object
   */
  static async login(req, res) {
    try {
      const { error } = validateLogin(req.body);
      if (error) return Response.error(res, 400, error.details[0].message);

      const { username, password } = req.body;
      const user = await User.findOne({ username }).exec();
      if (!user) return Response.error(res, 404, 'User not found.');

      const checkPassword = await user.comparePassword(password);
      if (!checkPassword) {
        return Response.error(res, 403, 'Wrong password');
      }
      const token = user.generateToken();
      const data = {
        token,
        user_id: user._id,
      };
      return Response.success(res, 200, data, `welcome ${user.username}`);
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }
}

export default AuthController;
