const request = require('supertest');
const httpStatus = require('http-status');
const { Types } = require('mongoose');
const app = require('../../src/app');
const { admin, userOne, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { facilitatorOne, facilitatorTwo, insertFacilitators } = require('../fixtures/facilitator.fixture');
const { courseOne, courseTwo, courseThree, insertCourses } = require('../fixtures/course.fixture');
const setupTestDB = require('../utils/setupTestDB');
const generateText = require('../utils/generateText');
const { Course } = require('../../src/models');

setupTestDB();

describe('Course routes', () => {
  describe('POST /v1/courses', () => {
    let newCourse;
    beforeEach(() => {
      newCourse = {
        title: 'How to play chess',
        facilitatorId: 'valud mongo id',
        category: 'Chess',
        description: 'Teaches the basics of chess: how to move pieces and how to checkmate',
        difficulty: 'beginner',
        duration: 1,
        thumbnail: 'https://www.svgrepo.com/show/42988/online-course.svg',
      };
    });

    test('should return 201 and create a new course if data is ok', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);
      newCourse.facilitatorId = facilitatorOne._id.toHexString();

      const res = await request(app)
        .post('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        facilitator: newCourse.facilitatorId,
        title: newCourse.title,
        status: 'draft',
        category: newCourse.category.toLowerCase(),
        description: newCourse.description,
        difficulty: newCourse.difficulty,
        duration: newCourse.duration,
        thumbnail: newCourse.thumbnail,
        rating: 0,
        modules: expect.any(Array),
        reviews: expect.any(Array),
      });

      const dbCourse = await Course.findById(res.body.id).lean();
      expect(dbCourse).toBeDefined();
      expect(dbCourse).toMatchObject({
        _id: new Types.ObjectId(res.body.id),
        facilitator: new Types.ObjectId(newCourse.facilitatorId),
        title: res.body.title,
        status: res.body.status,
        category: res.body.category,
        description: res.body.description,
        difficulty: res.body.difficulty,
        duration: res.body.duration,
        thumbnail: res.body.thumbnail,
        rating: res.body.rating,
      });
    });

    test('should return a 400 error if facilitatorId is invalid', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.facilitatorId = 'invalidId';

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if title is not a string with length <= 200', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.title = generateText(201);

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if status is not valid', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.status = 'invalidStatus';

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if category is not a string with length <= 100', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.category = generateText(101);

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if description is not a string with length <= 10k', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.description = generateText(10001);

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if difficulty is invalid', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.difficulty = 'invalidDifficulty';

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if duration is not a positive number', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.duration = -1;

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if thumbnail is not a valid url', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.thumbnail = 'invalidURL';

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if rating field is present', async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.rating = 5;

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 403 error if client role does not have required permissions', async () => {
      await insertUsers([userOne]);
      await insertFacilitators([facilitatorOne]);

      newCourse.facilitatorId = facilitatorOne._id.toHexString();

      await request(app)
        .post('/v1/students')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/courses', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertFacilitators([facilitatorOne, facilitatorTwo]);
      await Course.insertMany([courseOne, courseTwo, courseThree]);

      const res = await request(app).get('/v1/courses').set('Authorization', `Bearer ${adminAccessToken}`).expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toMatchObject({
        id: courseOne._id.toHexString(),
        facilitator: courseOne.facilitator.toHexString(),
      });
    });

    test('should correctly apply filter on title field', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertFacilitators([facilitatorOne, facilitatorTwo]);
      await Course.insertMany([courseOne, courseTwo, courseThree]);

      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ title: 'How to play chess' })
        .send()
        .expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });

      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0]).toMatchObject({
        id: courseOne._id.toHexString(),
        facilitator: courseOne.facilitator.toHexString(),
      });
    });

    test('should correctly apply filter on category field', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertFacilitators([facilitatorOne, facilitatorTwo]);
      await Course.insertMany([courseOne, courseTwo, courseThree]);

      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ category: 'chess' })
        .send()
        .expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toMatchObject({
        id: courseOne._id.toHexString(),
        facilitator: courseOne.facilitator.toHexString(),
      });
    });

    test('should correctly apply filter on difficulty field', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertFacilitators([facilitatorOne, facilitatorTwo]);
      await Course.insertMany([courseOne, courseTwo, courseThree]);

      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ difficulty: 'intermediate' })
        .send()
        .expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });

      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0]).toMatchObject({
        id: courseTwo._id.toHexString(),
        facilitator: courseTwo.facilitator.toHexString(),
      });
    });

    test('should correctly apply filter on status field', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertFacilitators([facilitatorOne, facilitatorTwo]);
      await Course.insertMany([courseOne, courseTwo, courseThree]);

      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ status: 'draft' })
        .send()
        .expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toMatchObject({
        id: courseOne._id.toHexString(),
        facilitator: courseOne.facilitator.toHexString(),
      });
    });

    test('should correctly apply filter on rating field', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertFacilitators([facilitatorOne, facilitatorTwo]);
      await Course.insertMany([courseOne, courseTwo, courseThree]);

      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ rating: 0 })
        .send()
        .expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });

      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toMatchObject({
        id: courseOne._id.toHexString(),
        facilitator: courseOne.facilitator.toHexString(),
      });
    });

    test('should return 403 if client role does not have required permissions', async () => {
      await insertUsers([userOne]);
      await insertFacilitators([facilitatorOne]);
      await insertCourses([courseOne]);

      await request(app).get('/v1/courses').set('Authorization', `Bearer ${userOneAccessToken}`).expect(403);
    });
  });

  describe('GET /v1/courses/:courseId', () => {
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);
      await insertCourses([courseOne]);
    });

    test('should return 200 and course data if course id is valid', async () => {
      const res = await request(app)
        .get(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
      expect(res.body.id).toEqual(courseOne._id.toHexString()); // TODO: add toHexString?
    });

    test('should return a 404 error if course is not found', async () => {
      await request(app)
        .get(`/v1/courses/${courseTwo._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return a 400 error if course id is invalid', async () => {
      await request(app)
        .get(`/v1/courses/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 403 error if client lacks required permissions', async () => {
      await request(app)
        .get(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('PATCH /v1/courses/:courseId', () => {
    let updateBody;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);
      await insertCourses([courseOne]);

      updateBody = {
        title: 'new title',
        description: 'new description',
        difficulty: 'advanced',
        duration: 2,
        status: 'published',
      };
    });

    test('should return 200 and update course if data is ok', async () => {
      const res = await request(app)
        .patch(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
      expect(res.body).toMatchObject({
        title: updateBody.title,
        description: updateBody.description,
        difficulty: updateBody.difficulty,
        duration: updateBody.duration,
        status: updateBody.status,
      });

      const dbCourse = await Course.findById(courseOne._id).lean();
      expect(dbCourse).toBeDefined();
      expect(dbCourse).toMatchObject({
        title: res.body.title,
        description: res.body.description,
        difficulty: res.body.difficulty,
        duration: res.body.duration,
        status: res.body.status,
      });
    });

    test('should return a 400 error if body is empty', async () => {
      updateBody = {};
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if client tries to update facilitator field', async () => {
      updateBody.facilitatorId = facilitatorTwo._id;
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if title field is not a string up to 200 characters long', async () => {
      updateBody.title = generateText(201);
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if description field is not a string up to 10k characters long', async () => {
      updateBody.description = generateText(10001);
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if difficulty is invalid', async () => {
      updateBody.difficulty = 'invalidDifficulty';
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if status is invalid', async () => {
      updateBody.status = 'invalidStatus';
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if duration is not a positive number', async () => {
      updateBody.duration = 0;
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 403 error if client lacks required permissions', async () => {
      await request(app)
        .patch(`/v1/courses/${courseOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return a 404 error if course does not exist', async () => {
      await request(app)
        .patch(`/v1/courses/${courseTwo._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/courses/:courseId', () => {
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertFacilitators([facilitatorOne]);
      await insertCourses([courseOne]);
    });
    test('should return 204 if data is ok', async () => {
      await request(app)
        .delete(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbCourse = await Course.findById(courseOne._id);
      expect(dbCourse).toBeNull();
    });

    test('should return 404 error if course is not found', async () => {
      await request(app)
        .delete(`/v1/courses/${courseTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
