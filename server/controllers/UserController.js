/* eslint-disable no-underscore-dangle */
import { User } from '../models/User';
/**
 * @class UserController
 * @description specifies which method handles a request for User endpoints
 * @exports UserController
 */
class UserController {
  /**
   * @method profile
   * @description Views the profile of a registered user by username
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @return {json} Returns json object
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
   * @return {json} Returns json object
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
