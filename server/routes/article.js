import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import Auth from '../middleware/auth';

const articleRoute = Router();

articleRoute.get('/articles', Auth.authenticate, ArticleController.getAllArticles);
articleRoute.post('/articles', Auth.authenticate, ArticleController.createArticle);
articleRoute.post('/articles/:article/comments', Auth.authenticate, ArticleController.addComments);
articleRoute.get('/articles/:slug', Auth.authenticate, ArticleController.getArticleBySlug);
articleRoute.delete('/articles/:id', Auth.authenticate, ArticleController.deleteArticle);
articleRoute.delete('/articles/comments/:comment', Auth.authenticate, ArticleController.deleteComment);

export default articleRoute;
