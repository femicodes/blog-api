/* eslint-disable no-underscore-dangle */
import User from '../models/User';
import Article from '../models/Article';
import validateUserProfile from '../validations/user';
import Response from '../util/Response';

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
    try {
      const { username } = req.params;
      const user = await User.findOne({ username }).exec();
      if (!user) return Response.error(res, 404, 'User with given username not found!');
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
      return Response.error(res, 400, 'An error occured.');
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
    try {
      const { error } = validateUserProfile(req.body);
      if (error) return Response.error(res, 400, error.details[0].message);

      const userName = req.params.username;
      const user = req.user.username;

      if (user !== userName) return Response.error(res, 401, 'You can\'t edit this profile!');

      const userUpdate = await User.findByIdAndUpdate(req.user._id, { $set: req.body },
        { new: true });
      if (!userUpdate) return Response.error(res, 404, 'User with given username not found!');

      const data = {
        id: userUpdate._id,
        username: userUpdate.username,
        email: userUpdate.email,
        bio: userUpdate.bio,
      };

      return Response.success(res, 201, data, 'Profile updated!');
    } catch (err) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
   * @method follow
   * @description A registered user can follow another registered user by username
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @return {json} Returns json object
   */
  static async follow(req, res) {
    try {
      const { username } = req.params;
      const user = req.user._id;

      const checkUsername = await User.findOne({ username }).exec();
      if (!checkUsername) return Response.error(res, 404, 'Username does\'nt exist');

      if (user.equals(checkUsername._id)) return Response.error(res, 403, 'You can\'t follow yourself');

      const userA = user;
      const userB = checkUsername._id;

      const isFollowing = await User.findById(userA);
      if (isFollowing.following.includes(userB)) return Response.error(res, 403, 'You already follow this user');

      await User.findByIdAndUpdate(userA, {
        $addToSet: { following: userB },
      }, { new: true });

      await User.findByIdAndUpdate(userB, {
        $addToSet: { followers: userA },
      }, { new: true });

      return Response.success(res, 200, 'You just followed this user!');
    } catch (error) {
      return Response.error(res, 400, 'An error occured');
    }
  }

  /**
   * @method unfollow
   * @description A registered user can unfollow another registered user by username
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @return {json} Returns json object
   */
  static async unfollow(req, res) {
    try {
      const { username } = req.params;
      const user = req.user._id;

      const checkUsername = await User.findOne({ username }).exec();
      if (!checkUsername) return Response.error(res, 404, 'Username does\'nt exist');

      if (user.equals(checkUsername._id)) return Response.error(res, 403, 'You can\'t unfollow yourself');

      const userA = user;
      const userB = checkUsername._id;

      const isFollowing = await User.findById(userA);
      if (!isFollowing.following.includes(userB)) return Response.error(res, 403, 'You already unfollowed this user');

      await User.findByIdAndUpdate(userA, {
        $pull: { following: userB },
      }, { new: true });

      await User.findByIdAndUpdate(userB, {
        $pull: { followers: userA },
      }, { new: true });

      return Response.success(res, 200, 'You just unfollowed this user!');
    } catch (error) {
      return Response.error(res, 400, 'An error occured');
    }
  }

  /**
    * @method feed
    * @description Displays articles of who the user follows
    * @param {object} req - The Request Object
    * @param {object} res - The Response Object
    * @return {json} Returns json object
    */
  static async feed(req, res) {
    try {
      const { user } = req;
      const page = req.query.page || 1;
      const perPage = 10;
      const article = await Article
        .find({ author: { $in: user.following } })
        .sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec();
      const articles = article.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        body: item.body,
        tags: item.tags,
        tagsCount: item.tags.length,
        slug: item.slug,
        comments: item.comments,
        favourites: item.favourites,
        favouritesCount: item.favourites.length,
        createdAt: item.createdAt,
        author: item.author,
      }));

      const data = {
        page,
        count: articles.length,
        data: articles,
      };
      return Response.success(res, 200, data);
    } catch (error) {
      return Response.error(res, 400, 'An error occured');
    }
  }
}

export default UserController;
