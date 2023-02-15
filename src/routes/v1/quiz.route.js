const express = require('express');
const validate = require('../../middlewares/validate');
const quizValidation = require('../../validations/quiz.validation');
const quizController = require('../../controllers/quiz.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), validate(quizValidation.createQuiz), quizController.createQuiz);
router.get('/:quizId/results', auth(), quizController.results);
router.get('/list', auth(), quizController.listQuizes);
router.get('/:quizId', quizController.getQuiz);
router.post('/:quizId', validate(quizValidation.submitQuiz), quizController.submitQuiz);

module.exports = router;
