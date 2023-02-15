const httpStatus = require('http-status');
const { Quiz } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a quiz
 * @param {Object} quizBody
 * @returns {Promise<Quiz>}
 */
const createQuiz = async (quizBody) => {
  return Quiz.create(quizBody);
};

/**
 * Query for quiz by id without answers
 * @param {ObjectId} id
 * @returns {Promise<Quiz>}
 */
const getQuizByIdWithoutAnswers = async (id) => {
  return Quiz.findById(id).select('title description questions.question questions.options');
};

/**
 * Query for quiz by id
 * @param {ObjectId} id
 * @returns {Promise<Quiz>}
 */
const getQuizById = async (id) => {
  return Quiz.findById(id);
};

/**
 * List quizes
 * @param {ObjectId} userId
 * @returns {Promise<Quiz[]>}
 */
const listQuizes = async (userId) => {
  return Quiz.find({ user: userId }).select('title description');
};

/**
 * Get quiz results
 * @param {ObjectId} id
 * @returns {Promise<Quiz[]>}
 */
const results = async (id) => {
  return Quiz.findById(id).select('title scores');
};

/**
 * Submit quiz
 * @param {ObjectId} quizId
 * @param {Object} answers
 * @param {string} name
 * @returns {Promise<Quiz>}
 */
const submitQuiz = async (quizId, answers, name) => {
  const quiz = await getQuizById(quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  const score = await quiz.calculateScore(answers);
  quiz.scores.push({ name, score });
  await quiz.save();
  return { score };
};

module.exports = {
  createQuiz,
  getQuizByIdWithoutAnswers,
  getQuizById,
  listQuizes,
  results,
  submitQuiz,
};
