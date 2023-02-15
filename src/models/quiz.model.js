const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: Array,
      required: true,
      trim: true,
      options: {
        type: Array,
        required: true,
        trim: true,
      },
      answer: {
        type: Array,
        required: true,
        trim: true,
      },
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    scores: {
      type: Array,
      required: false,
      trim: true,
      score: {
        type: Number,
        required: true,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
quizSchema.plugin(toJSON);
quizSchema.plugin(paginate);

/**
 * Calculate score
 * @param {array} answers
 * @returns {Promise<Number>}
 */
quizSchema.methods.calculateScore = async function (answers) {
  const quizQuestions = this.questions;
  let score = 0;
  for (let i = 0; i < quizQuestions.length; i += 1) {
    if (quizQuestions[i].answer.includes(answers[i].answer)) {
      score += 1;
    }
  }
  return score;
};

/**
 * @typedef Quiz
 */
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
