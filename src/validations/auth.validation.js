const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const createQuiz = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    questions: Joi.array().items(
      Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string().required()),
        answer: Joi.string().required(),
      })
    ),
  }),
};

const submitQuiz = {
  body: Joi.object().keys({
    answers: Joi.array().items(
      Joi.object().keys({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      })
    ),
    name: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  createQuiz,
  submitQuiz,
};
