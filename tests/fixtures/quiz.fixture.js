const mongoose = require('mongoose');
const faker = require('faker');
const Quiz = require('../../src/models/quiz.model');

const quizOne = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.word(),
  description: faker.lorem.words(),
  questions: [
    {
      question: faker.lorem.words(),
      options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    },
    {
      question: faker.lorem.words(),
      options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    },
    {
      question: faker.lorem.words(),
      options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    },
  ],
  scores: [],
};
for (let i = 0; i < quizOne.questions; i += 1) {
  quizOne.questions[i].answer = quizOne.questions[i].options[faker.datatype.number(3)];
}

const quizTwo = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.word(),
  description: faker.lorem.words(),
  questions: [
    {
      question: faker.lorem.words(),
      options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    },
    {
      question: faker.lorem.words(),
      options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    },
    {
      question: faker.lorem.words(),
      options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
    },
  ],
  scores: [],
};
for (let i = 0; i < quizTwo.questions; i += 1) {
  quizTwo.questions[i].answer = quizTwo.questions[i].options[faker.datatype.number(3)];
}

const insertQuizes = async (quizes) => {
  await Quiz.insertMany(quizes);
};

module.exports = {
  quizOne,
  quizTwo,
  insertQuizes,
};
