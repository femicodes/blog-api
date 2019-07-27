import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import Auth from '../middleware/auth';

const articleRoute = Router();

articleRoute.get('/articles', Auth.authenticate, ArticleController.getAllArticles);
articleRoute.post('/articles', Auth.authenticate, ArticleController.createArticle);
articleRoute.get('/articles/:slug', Auth.authenticate, ArticleController.getArticleBySlug);

export default articleRoute;
