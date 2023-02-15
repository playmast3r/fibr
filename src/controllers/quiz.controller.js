const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { quizService } = require('../services');

const createQuiz = catchAsync(async (req, res) => {
  req.body.user = req.user._id;
  const quiz = await quizService.createQuiz(req.body);
  res.status(httpStatus.CREATED).send(quiz);
});

const getQuiz = catchAsync(async (req, res) => {
  const quiz = await quizService.getQuizByIdWithoutAnswers(req.params.quizId);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  }
  res.send(quiz);
});

const listQuizes = catchAsync(async (req, res) => {
  const userId = req.user._id;
  let quizes = await quizService.listQuizes(userId);

  // add sharelink to each quiz object
  quizes = await Promise.all(
    quizes.map(async (quiz) => {
      const shareLink = `${req.protocol}://${req.get('host')}/v1/quiz/${quiz._id}`;
      return { ...quiz.toObject(), shareLink };
    })
  );
  res.send(quizes);
});

const results = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  const result = await quizService.results(quizId);

  // sort scores by score - used sort in code because aggregate sort is heavy on db
  const { scores } = result;
  scores.sort((a, b) => b.score - a.score);
  result.scores = scores;
  res.send(result);
});

const submitQuiz = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  const { answers, name } = req.body;
  const result = await quizService.submitQuiz(quizId, answers, name);
  res.send(result);
});

module.exports = {
  createQuiz,
  getQuiz,
  listQuizes,
  results,
  submitQuiz,
};
