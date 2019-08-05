import Joi from '@hapi/joi';

const validateUserProfile = (user) => {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(30),
    email: Joi.string()
      .min(5)
      .max(30)
      .email(),
    bio: Joi.string()
      .min(5)
      .max(255),
  };
  return Joi.validate(user, schema);
};

export default validateUserProfile;
