import Joi from '@hapi/joi';

export const validateArticle = (article) => {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(70)
      .required(),
    description: Joi.string()
      .min(5)
      .max(150)
      .required(),
    body: Joi.string()
      .min(5)
      .max(500)
      .required(),
  };
  return Joi.validate(article, schema);
};

export const validateComment = (comment) => {
  const schema = {
    text: Joi.string()
      .min(3)
      .max(70)
      .required(),
  };
  return Joi.validate(comment, schema);
};
