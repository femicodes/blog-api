/* eslint-disable no-underscore-dangle */
import { User, validateUser } from '../models/User';
/**
 * @class UserController
 * @description specifies which method handles a request for User endpoints
 * @exports UserController
 */
class UserController {
  /**
   * @method signup
   * @description Registers a user if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
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
      if (checkUser) return res.status(400).json({ status: 'error', message: 'User already registered.' });

      const checkUsername = await User.findOne({ username });
      if (checkUsername) return res.status(400).json({ status: 'error', message: 'User already registered.' });

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
   * @returns {void}
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
        message: `welcome ${user.username}`,
        token,
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }

  /**
   * @method profile
   * @description Views the profile of a registered user by username
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
   */
  static async profile(req, res) {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username }).exec();
      return res.status(200).json({
        status: 'success',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          bio: user.bio,
          my_articles: user.myArticles,
        },
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }

  /**
   * @method editProfile
   * @description Edits the profile a registered user by id
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
   */
  static async editProfile(req, res) {
    const { id } = req.params;
    const {
      username, email, bio,
    } = req.body;

    try {
      const user = await User.findOneAndUpdate(id, {
        username, email, bio,
      }, { new: true });
      if (!user) return res.status(404).json({ status: 'error', message: 'User with given id not found!' });

      return res.status(200).json({
        status: 'success',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          bio: user.bio,
        },
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }
}

export default UserController;
