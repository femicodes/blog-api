import { Router } from 'express';
import ArticleController from '../controllers/ArticleController';
import Auth from '../middleware/auth';

const articleRoute = Router();

articleRoute.get('/articles', Auth.authenticate, ArticleController.getAllArticles);
articleRoute.post('/articles', Auth.authenticate, ArticleController.createArticle);

articleRoute.get('/articles/:slug', Auth.authenticate, ArticleController.getArticleBySlug);
articleRoute.delete('/articles/:id', Auth.authenticate, ArticleController.deleteArticle);

articleRoute.post('/articles/:article/comments', Auth.authenticate, ArticleController.addComments);
articleRoute.delete('/articles/comments/:comment', Auth.authenticate, ArticleController.deleteComment);

articleRoute.post('/articles/:article/favourite', Auth.authenticate, ArticleController.favouriteArticle);
articleRoute.post('/articles/:article/unfavourite', Auth.authenticate, ArticleController.unfavouriteArticle);

export default articleRoute;
