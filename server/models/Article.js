/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import slug from 'slug';

const ArticleSchema = Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tags: [String],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const autoPopulateAuthor = function (next) {
  this.populate({
    path: 'author',
    select: '_id username email bio -myArticles',
  });
  next();
};

ArticleSchema.pre('find', autoPopulateAuthor);
ArticleSchema.pre('findOne', autoPopulateAuthor);

ArticleSchema.pre('save', function () {
  this.slug = slug(this.title, { lower: true });
});

const Article = model('Article', ArticleSchema);

export default Article;
