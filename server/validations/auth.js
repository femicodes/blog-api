import Joi from '@hapi/joi';


export const validateSignup = (user) => {
  const schema = {
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .min(5)
      .max(30)
      .required()
      .email(),
    password: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required(),
  };
  return Joi.validate(user, schema);
};

export const validateLogin = (user) => {
  const schema = {
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required(),
  };
  return Joi.validate(user, schema);
};
