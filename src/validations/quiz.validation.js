const Joi = require('joi');
const { title } = require('./custom.validation');

const createQuiz = {
  body: Joi.object().keys({
    title: Joi.string().required().custom(title),
    description: Joi.string().required(),
    questions: Joi.array().items(
      Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string().required()),
        answer: Joi.array().items(Joi.string().required()),
      })
    ),
  }),
};

const submitQuiz = {
  body: Joi.object().keys({
    answers: Joi.array().items(
      Joi.object().keys({
        answer: Joi.string().required(),
      })
    ),
    name: Joi.string().required(),
  }),
};

module.exports = {
  createQuiz,
  submitQuiz,
};
