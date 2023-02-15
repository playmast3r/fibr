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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
quizSchema.plugin(toJSON);
quizSchema.plugin(paginate);

/**
 * @typedef Quiz
 */
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
