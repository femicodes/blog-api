/* eslint-disable no-underscore-dangle */
import Article from '../models/Article';

class ArticleController {
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
}

export default ArticleController;
