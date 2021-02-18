const Joi = require("joi");
const schemas = {
  articleSchema: Joi.object().keys({
    headLine: Joi.string().required(),
    subHead: Joi.string().required(),
    content: Joi.string().required(),
    category: Joi.object().keys({
      name: Joi.string().required(),
      img: Joi.string(),
    }),
    cover: Joi.string().required(),
  }),
  authorSchema: Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().required(),
  }),
  reviewSchema: Joi.object().keys({
    text: Joi.string().required(),
    user: Joi.string(),
  }),
};
module.exports = schemas;
