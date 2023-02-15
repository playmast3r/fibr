const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Quiz } = require('../../src/models');
const { quizOne, quizTwo, insertQuizes } = require('../fixtures/quiz.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { userOne, insertUsers } = require('../fixtures/user.fixture');

setupTestDB();

describe('Quiz routes', () => {
  describe('POST /v1/quiz', () => {
    let newQuiz;

    beforeEach(async () => {
      newQuiz = {
        title: faker.lorem.word(),
        description: faker.lorem.words(),
        questions: [],
      };
      for (let i = 0; i < faker.datatype.number(10); i += 1) {
        newQuiz.questions.push({
          question: faker.lorem.words(),
          options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
        });
        const answer = newQuiz.questions[i].options[faker.datatype.number(3)];
        newQuiz.questions[i].answer = [answer];
      }
    });

    test('should return 201 and successfully create new quiz if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/quiz')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newQuiz)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        title: newQuiz.title,
        description: newQuiz.description,
        scores: expect.anything(),
        questions: newQuiz.questions,
        user: userOne._id.toHexString(),
      });

      const dbQuiz = await Quiz.findById(res.body.id);
      expect(dbQuiz).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/quiz').send(newQuiz).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if title is invalid', async () => {
      await insertUsers([userOne]);
      newQuiz.title = '1234';

      await request(app)
        .post('/v1/quiz')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newQuiz)
        .expect(httpStatus.BAD_REQUEST);

      newQuiz.title = 'ABCDEF!';

      await request(app)
        .post('/v1/quiz')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newQuiz)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if description is not present', async () => {
      await insertUsers([userOne]);
      delete newQuiz.description;

      await request(app)
        .post('/v1/quiz')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newQuiz)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/quiz/list', () => {
    let newQuiz;

    beforeEach(async () => {
      newQuiz = {
        title: faker.lorem.word(),
        description: faker.lorem.words(),
        questions: [],
      };
      for (let i = 0; i < faker.datatype.number(10); i += 1) {
        newQuiz.questions.push({
          question: faker.lorem.words(),
          options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
        });
        const answer = newQuiz.questions[i].options[faker.datatype.number(3)];
        newQuiz.questions[i].answer = [answer];
      }
    });
    test('should return 200', async () => {
      await insertUsers([userOne]);
      quizOne.user = userOne._id;
      quizTwo.user = userOne._id;
      await insertQuizes([quizOne, quizTwo]);

      const res = await request(app)
        .get('/v1/quiz/list')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toEqual({
        _id: quizOne._id.toHexString(),
        title: quizOne.title,
        description: quizOne.description,
        shareLink: expect.anything(),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertUsers([userOne]);
      quizOne.user = userOne._id;
      quizTwo.user = userOne._id;
      await insertQuizes([quizOne, quizTwo]);

      await request(app).get('/v1/quiz/list').send().expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/quiz/:quizId', () => {
    let newQuiz;

    beforeEach(async () => {
      newQuiz = {
        title: faker.lorem.word(),
        description: faker.lorem.words(),
        questions: [],
      };
      for (let i = 0; i < faker.datatype.number(10); i += 1) {
        newQuiz.questions.push({
          question: faker.lorem.words(),
          options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
        });
        const answer = newQuiz.questions[i].options[faker.datatype.number(3)];
        newQuiz.questions[i].answer = [answer];
      }
    });
    test('should return 200', async () => {
      await insertQuizes([quizOne]);

      const res = await request(app).get(`/v1/quiz/${quizOne._id}`).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: quizOne._id.toHexString(),
        title: quizOne.title,
        description: quizOne.description,
        questions: expect.anything(),
      });

      expect(res.body.questions[0]).not.toHaveProperty('answer');
    });

    test('should return 200 even if access token is present', async () => {
      await insertUsers([userOne]);

      await insertQuizes([quizOne]);

      const res = await request(app)
        .get(`/v1/quiz/${quizOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: quizOne._id.toHexString(),
        title: quizOne.title,
        description: quizOne.description,
        questions: expect.anything(),
      });

      expect(res.body.questions[0]).not.toHaveProperty('answer');
    });

    test('should return 400 error if quizId is not a valid mongo id', async () => {
      await insertQuizes([quizOne]);

      await request(app).get('/v1/quiz/invalidId').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if quiz is not found', async () => {
      await request(app).get(`/v1/quiz/${mongoose.Types.ObjectId()}`).send().expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST /v1/quiz/:quizId', () => {
    let newQuiz;

    beforeEach(() => {
      newQuiz = {
        title: faker.lorem.word(),
        description: faker.lorem.words(),
        questions: [],
      };
      for (let i = 0; i < faker.datatype.number(10); i += 1) {
        newQuiz.questions.push({
          question: faker.lorem.words(),
          options: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
        });
        const answer = newQuiz.questions[i].options[faker.datatype.number(3)];
        newQuiz.questions[i].answer = [answer];
      }
    });

    test('should return 201 and successfully give score', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/quiz')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newQuiz)
        .expect(httpStatus.CREATED);

      const answers = [];
      let score = 0;
      for (let i = 0; i < newQuiz.questions.length; i += 1) {
        answers.push({
          answer: newQuiz.questions[i].options[faker.datatype.number(3)],
        });
        if (newQuiz.questions[i].answer.includes(answers[i].answer)) {
          score += 1;
        }
      }

      const body = {
        answers,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      };

      const res2 = await request(app).post(`/v1/quiz/${res.body.id}`).send(body).expect(httpStatus.OK);

      expect(res2.body).toEqual({
        score,
      });
    });
  });
});
