/* eslint-disable no-underscore-dangle */
import Article from '../models/Article';

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
   * @returns {Object} return created article
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
     * @returns {Object} return all articles
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
        slug: item.slug,
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
     * @returns {Object} return article
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
     * @returns {void}
     */
  static async deleteArticle(req, res) {
    const { id } = req.params;
    const author = req.user._id;

    try {
      const checkAuthor = await Article.find({ author });
      if (!checkAuthor) {
        return res.status(401).json({ status: 'error', message: 'You\'re not allowed to perform this action' });
      }
      await Article.findByIdAndDelete(id).exec();
      return res.status(204).json({ status: 'success', message: 'Successfully deleted article' });
    } catch (error) {
      return res.status(400).json({ status: 'error', message: 'an error occured' });
    }
  }
}

export default ArticleController;
