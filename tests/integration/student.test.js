const request = require('supertest');
const httpStatus = require('http-status');
const { Types } = require('mongoose');
const app = require('../../src/app');
const { admin, userOne, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');
const { studentOne, studentTwo } = require('../fixtures/student.fixture');
const setupTestDB = require('../utils/setupTestDB');
const { Student } = require('../../src/models');

setupTestDB();

describe('Student routes', () => {
  describe('POST /v1/students', () => {
    let newStudent;
    beforeEach(() => {
      newStudent = {
        userId: 'objectId',
      };
    });

    test('should return 201 and create a new student if data is ok', async () => {
      await insertUsers([admin, userOne]);
      newStudent.userId = userOne._id.toHexString();

      const res = await request(app)
        .post('/v1/students')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStudent)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        user: newStudent.userId,
        completedBadges: expect.any(Array),
      });

      const dbStudent = await Student.findById(res.body.id);
      expect(dbStudent).toBeDefined();
      expect(dbStudent).toMatchObject({ user: new Types.ObjectId(newStudent.userId) });
    });
    test('should return a 400 error if userId is invalid', async () => {
      await insertUsers([admin, userOne]);
      newStudent.userId = 'invalidId';

      await request(app)
        .post('/v1/students')
        .set('Authorization', ` Bearer ${adminAccessToken}`)
        .send(newStudent)
        .expect(httpStatus.BAD_REQUEST);
    });
    test('should return a 400 error if student already exists', async () => {
      await insertUsers([admin, userOne]);
      await Student.create(studentOne);

      newStudent.userId = userOne._id.toHexString();

      await request(app)
        .post('/v1/students')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newStudent)
        .expect(httpStatus.BAD_REQUEST);
    });
    test('should return a 403 error if client role does not have required permissions', async () => {
      await insertUsers([userOne]);
      newStudent.userId = userOne._id.toHexString();

      await request(app)
        .post('/v1/students')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newStudent)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/students', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await Student.insertMany([studentOne, studentTwo]);

      const res = await request(app).get('/v1/students').set('Authorization', `Bearer ${adminAccessToken}`).expect(200);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });

      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toMatchObject({
        id: expect.anything(),
        user: expect.anything(),
      });
    });

    test('should return 403 if client role does not have required permissions', async () => {
      await insertUsers([userOne]);
      await Student.create([studentOne]);

      await request(app).get('/v1/students').set('Authorization', `Bearer ${userOneAccessToken}`).expect(403);
    });
  });

  describe('GET /v1/students/:studentId', () => {
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await Student.create(studentOne);
    });

    test('should return 200 and student data if student id is valid', async () => {
      const res = await request(app)
        .get(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
      expect(res.body.id).toEqual(studentOne._id.toHexString()); // TODO: add toHexString?
    });

    test('should return a 404 error if student is not found', async () => {
      await request(app)
        .get(`/v1/students/${studentTwo._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return a 400 error if student id is invalid', async () => {
      await request(app)
        .get(`/v1/students/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 403 error if client lacks required permissions', async () => {
      await request(app)
        .get(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('PATCH /v1/students/:id', () => {
    let updateBody;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await Student.create(studentOne);

      updateBody = {
        stats: {
          completedCourses: 0,
          streak: 0,
        },
        completedBadges: [{ title: 'Badge title', description: 'badge description', earnedAt: new Date() }],
      };
    });

    test('should return 200 and update student if data is ok', async () => {
      const res = await request(app)
        .patch(`/v1/students/${studentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
      expect(res.body).toMatchObject({
        stats: updateBody.stats,
        completedBadges: updateBody.completedBadges.map((badge) => ({ ...badge, earnedAt: badge.earnedAt.toISOString() })),
      });

      const dbStudent = await Student.findById(studentOne._id).lean();
      expect(dbStudent).toBeDefined();
      expect(dbStudent).toMatchObject({
        stats: expect.objectContaining(updateBody.stats),
      });

      expect(dbStudent.completedBadges).toHaveLength(updateBody.completedBadges.length);
      updateBody.completedBadges.forEach((badge, idx) => {
        expect(dbStudent.completedBadges[idx]).toMatchObject({
          title: badge.title,
          description: badge.description,
        });
        expect(new Date(dbStudent.completedBadges[idx].earnedAt).toISOString()).toEqual(badge.earnedAt.toISOString());
      });
    });

    test('should return a 400 error if body is empty', async () => {
      updateBody = {};
      await request(app)
        .patch(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if client tries to update user field', async () => {
      updateBody.user = userTwo._id;
      await request(app)
        .patch(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if completedBadges field is not an array', async () => {
      updateBody.completedBadges = 'invalidArray';
      await request(app)
        .patch(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 400 error if stats field is not an object', async () => {
      updateBody.stats = 'invalidObject';
      await request(app)
        .patch(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return a 403 error if client lacks required permissions', async () => {
      await request(app)
        .patch(`/v1/students/${studentOne._id.toHexString()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return a 404 error if student does not exist', async () => {
      await request(app)
        .patch(`/v1/students/${studentTwo._id.toHexString()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
