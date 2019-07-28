/* eslint-disable no-underscore-dangle */
import Article from '../models/Article';
import { User } from '../models/User';
import Comment from '../models/Comment';

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
    const {
      title, author, description, body, tags,
    } = req.body;

    const article = new Article({
      title, author, description, body, tags,
    });

    try {
      const checkArticle = await Article.findOne({ title });
      if (checkArticle) return res.status(400).json({ status: 'error', message: 'Article exists!' });

      await article.save();

      await User.findByIdAndUpdate(author, {
        $addToSet: { myArticles: article._id },
      }, { new: true });

      return res.status(201).json({
        status: 'success',
        data: {
          id: article._id,
          title: article.title,
          description: article.description,
          body: article.body,
          tags: article.tags,
          slug: article.slug,
          likes: article.likes,
          likesCount: article.likes.length,
          createdAt: article.createdAt,
          author: article.author,
        },
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
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
      const article = await Article.find().exec();
      const articles = article.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        body: item.body,
        tags: item.tags,
        tagsCount: item.tags.length,
        slug: item.slug,
        comments: item.comments,
        likes: item.likes,
        likesCount: item.likes.length,
        createdAt: item.createdAt,
        author: item.author,
      }));
      return res.status(200).json({
        status: 'success',
        data: articles,
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
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
    const { slug } = req.params;
    try {
      const article = await Article.findOne({ slug }).exec();
      return res.status(200).json({
        status: 'success',
        data: {
          id: article._id,
          title: article.title,
          description: article.description,
          body: article.body,
          tags: article.tags,
          tagsCount: article.tags.length,
          slug: article.slug,
          likes: article.likes,
          likesCount: article.likes.length,
          createdAt: article.createdAt,
          author: article.author,
        },
      });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
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
    const { id } = req.params;
    const author = req.user._id;

    try {
      const checkAuthor = await Article.findById(author);
      if (!checkAuthor) return res.status(401).json({ status: 'error', message: 'You\'re not allowed to perform this action' });
      await Article.findByIdAndDelete(id).exec();
      await User.findByIdAndUpdate(author, {
        $pull: { myArticles: id },
      }, { new: true });
      return res.status(204).json({ status: 'success', message: 'Successfully deleted article' });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }

  /**
     * @method addComments
     * @description Add comment to an article by id
     * @param {object} req - The Request Object
     * @param {object} res - The Response Object
     * @returns {void}
     */
  static async addComments(req, res) {
    const { article } = req.params;
    const { text, user } = req.body;

    const comment = new Comment({ text, user, article });

    try {
      const checkArticle = await Article.findById(article).exec();
      if (!checkArticle) return res.status(400).json({ status: 'error', message: 'Article does not exist!' });

      const checkUser = await User.findById(user).exec();
      if (!checkUser) return res.status(400).json({ status: 'error', message: 'User does not exist!' });

      await comment.save();
      await Article.findByIdAndUpdate(article, {
        $addToSet: { comments: comment._id },
      }, { new: true });

      return res.status(200).json({ message: 'success', comment });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }

  /**
    * @method deleteComments
    * @description Delete an article's comment by id
    * @param {object} req - The Request Object
    * @param {object} res - The Response Object
    * @returns {void}
    */
  static async deleteComment(req, res) {
    const { comment } = req.params;
    const { article } = req.body;
    const author = req.user._id;

    try {
      const checkAuthor = await Article.findById(author);
      if (!checkAuthor) return res.status(401).json({ status: 'error', message: 'You\'re not allowed to perform this action' });

      await Comment.findByIdAndDelete(comment).exec();
      await Article.findByIdAndUpdate(article, {
        $pull: { comments: comment },
      }, { new: true });
      return res.status(204).json({ status: 'success', message: 'Successfully deleted article' });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }
}

export default ArticleController;
