import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';

const articleRoute = Router();

articleRoute.get('/articles', ArticleController.getAllArticles);
articleRoute.post('/articles', ArticleController.createArticle);
articleRoute.get('/articles/:slug', ArticleController.getArticleBySlug);

export default articleRoute;
