/* eslint-disable no-underscore-dangle */
import Article from '../models/Article';
import User from '../models/User';
import Comment from '../models/Comment';
import Response from '../util/Response';
import { validateArticle, validateComment } from '../validations/article';

/**
 * @class ArticleController
 * @description specifies which method handles a request for Article endpoints
 * @exports ArticleController
 */
class ArticleController {
  /**
   * @method createArticle
   * @description Creates an article if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @return {json} Returns json object
   */
  static async createArticle(req, res) {
    try {
      const { error } = validateArticle(req.body);
      if (error) return Response.error(res, 400, error.details[0].message);

      const {
        title, description, body, tags,
      } = req.body;

      const author = req.user._id;

      const article = new Article({
        title, description, body, tags,
      });

      const checkArticle = await Article.findOne({ title });
      if (checkArticle) return Response.error(res, 400, 'Article already exists!');

      await article.save();

      await User.findByIdAndUpdate(author, {
        $addToSet: { myArticles: article._id },
      }, { new: true });

      const data = {
        id: article._id,
        title: article.title,
        description: article.description,
        body: article.body,
        tags: article.tags,
        slug: article.slug,
        favourites: article.favourites,
        favouritesCount: article.favourites.length,
        createdAt: article.createdAt,
        author: article.author,
      };

      return Response.success(res, 201, data, 'Article created!');
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
     * @method getAllArticles
     * @description List all articles in the database
     * @param {object} req - The Request Object
     * @param {object} res - The Response Object
     * @return {json} Returns json object
     */
  static async getAllArticles(req, res) {
    try {
      const page = req.query.page || 1;
      const perPage = 10;
      const article = await Article
        .find()
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
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
     * @method getArticleBySlug
     * @description Retrieves a specific article by slug
     * @param {object} req - The Request Object
     * @param {object} res - The Response Object
     * @return {json} Returns json object
     */
  static async getArticleBySlug(req, res) {
    try {
      const { slug } = req.params;

      const article = await Article.findOne({ slug }).exec();
      if (!article) return Response.error(res, 404, 'Article doesn\'t exist!');

      const data = {
        id: article._id,
        title: article.title,
        description: article.description,
        body: article.body,
        tags: article.tags,
        tagsCount: article.tags.length,
        slug: article.slug,
        favourites: article.favourites,
        favouritesCount: article.favourites.length,
        createdAt: article.createdAt,
        author: article.author,
      };

      return Response.success(res, 200, data);
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
     * @method deleteArticle
     * @description Deletes a specific article by id
     * @param {object} req - The Request Object
     * @param {object} res - The Response Object
     * @return {json} Returns json object
     */
  static async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      const author = req.user._id;

      const checkAuthor = await Article.findById(author);
      if (!checkAuthor) return Response.error(res, 401, 'You\'re not allowed to perform this action');
      await Article.findByIdAndDelete(id).exec();
      await User.findByIdAndUpdate(author, {
        $pull: { myArticles: id },
      }, { new: true });
      return Response.success(res, 204, 'Successfully deleted article');
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
     * @method addComments
     * @description Add comment to an article by id
     * @param {object} req - The Request Object
     * @param {object} res - The Response Object
     * @return {json} Returns json object
     */
  static async addComments(req, res) {
    try {
      const { error } = validateComment(req.body);
      if (error) return Response.error(res, 400, error.details[0].message);

      const { article } = req.params;
      const { text } = req.body;
      const user = req.user._id;

      const comment = new Comment({ text, user, article });

      const checkArticle = await Article.findById(article).exec();
      if (!checkArticle) return Response.error(res, 404, 'Article does not exist!');

      const checkUser = await User.findById(user).exec();
      if (!checkUser) return Response.error(res, 404, 'User does not exist!');

      await comment.save();
      await Article.findByIdAndUpdate(article, {
        $addToSet: { comments: comment._id },
      }, { new: true });

      return Response.success(res, 200, comment);
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
    * @method deleteComments
    * @description Delete an article's comment by id
    * @param {object} req - The Request Object
    * @param {object} res - The Response Object
    * @return {json} Returns json object
    */
  static async deleteComment(req, res) {
    try {
      const { comment } = req.params;
      const { article } = req.body;
      const author = req.user._id;

      const checkAuthor = await Article.findById(author);
      if (!checkAuthor) return Response.error(res, 401, 'You\'re not allowed to perform this action');

      await Comment.findByIdAndDelete(comment).exec();
      await Article.findByIdAndUpdate(article, {
        $pull: { comments: comment },
      }, { new: true });
      return Response.success(res, 204, 'Successfully deleted article');
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
    * @method favouriteArticle
    * @description Adds article to list of user's favourite article
    * @param {object} req - The Request Object
    * @param {object} res - The Response Object
    * @return {json} Returns json object
    */
  static async favouriteArticle(req, res) {
    try {
      const { article } = req.params;
      const user = req.user._id;

      const checkArticle = await Article.findOne({ favourites: user }).exec();
      const checkUser = await User.findOne({ favourites: article }).exec();

      if (!checkArticle && !checkUser) {
        await Article.findByIdAndUpdate(article, {
          $addToSet: { favourites: user },
        }, { new: true });

        await User.findByIdAndUpdate(user, {
          $addToSet: { favourites: article },
        }, { new: true });

        return Response.success(res, 201, 'Article favourited!');
      }
      return Response.error(res, 400, 'You already favourited this article!');
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }

  /**
    * @method unfavouriteArticle
    * @description Removes article to list of user's favourite article
    * @param {object} req - The Request Object
    * @param {object} res - The Response Object
    * @return {json} Returns json object
    */
  static async unfavouriteArticle(req, res) {
    try {
      const { article } = req.params;
      const user = req.user._id;

      const checkArticle = await Article.findOne({ favourites: user });
      const checkUser = await User.findOne({ favourites: article });

      if (!checkArticle && !checkUser) {
        return Response.error(res, 400, 'There\'s nothing to unfavourite');
      }

      await Article.findByIdAndUpdate(article, {
        $pull: { favourites: user },
      }, { new: true });

      await User.findByIdAndUpdate(user, {
        $pull: { favourites: article },
      }, { new: true });

      return Response.success(res, 201, 'Article unfavourited!');
    } catch (error) {
      return Response.error(res, 400, 'An error occured.');
    }
  }
}

export default ArticleController;
