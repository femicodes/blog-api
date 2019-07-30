/* eslint-disable no-underscore-dangle */
import { User, validateUser } from '../models/User';
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
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

    const {
      email, password,
    } = req.body;
    let { username } = req.body;
    username = username.replace(/\s/g, '');

    const newUser = new User({
      username, email, password,
    });

    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) return res.status(400).json({ status: 'error', message: 'Email already in use.' });

      const checkUsername = await User.findOne({ username });
      if (checkUsername) return res.status(400).json({ status: 'error', message: 'User already taken.' });

      const user = await newUser.save();
      const token = await newUser.generateToken();
      return res.status(201).json({
        status: 'success',
        data: {
          token,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
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
    const { username, password } = req.body;
    if (!username || !password) return res.status(422).json({ status: 'error', message: 'Fields cannot be blank' });

    try {
      const user = await User.findOne({ username }).exec();
      if (!user) return res.status(400).json({ status: 'error', message: 'User not found.' });

      const checkPassword = await user.comparePassword(password);
      if (!checkPassword) {
        return res.status(422).json({ status: 'error', message: 'Wrong password' });
      }
      const token = user.generateToken();
      return res.status(200).json({
        status: 'success',
        user_id: user._id,
        message: `welcome ${user.username}`,
        token,
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }
}

export default AuthController;
