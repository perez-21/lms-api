const { Types } = require('mongoose');
const { Course } = require('../../../src/models');

describe('Course model', () => {
  describe('Course validation', () => {
    let newCourse;
    beforeEach(() => {
      newCourse = {
        title: 'How to play chess',
        facilitator: Types.ObjectId(),
        category: 'Chess',
        description: 'Teaches the basics of chess: how to move pieces and how to checkmate',
        difficulty: 'beginner',
        duration: 1,
        thumbnail: 'https://www.svgrepo.com/show/42988/online-course.svg',
      };
    });

    // title is string and not more than 200 characters
    test('should correctly validate a valid course', async () => {
      await expect(new Course(newCourse).validate()).resolves.toBeUndefined();
    });
    test('should throw a validation error if facilitator id is invalid', async () => {
      newCourse.facilitator = 'invalidId';
      await expect(new Course(newCourse).validate()).rejects.toThrow();
    });
    test('should throw a validation error if category is not a string shorter than 100 characters', async () => {
      newCourse.category = [];
      await expect(new Course(newCourse).validate()).rejects.toThrow();

      newCourse.category =
        'for this test cast to work, make sure the length of this sentence is always be more than a 100 characters.';
      await expect(new Course(newCourse).validate()).rejects.toThrow();
    });
    test('should throw validation error if status is not valid', async () => {
      newCourse.status = 'invalidStatus';
      await expect(new Course(newCourse).validate()).rejects.toThrow();
    });
    test('should correctly validate if status is valid', async () => {
      newCourse.status = 'published';
      await expect(new Course(newCourse).validate()).resolves.toBeUndefined();
    });
    test('should throw a validation error if duration is not a number greater than 0', async () => {
      newCourse.duration = 0;
      await expect(new Course(newCourse).validate()).rejects.toThrow();
    });
    test('should throw a validation error if thumbnail is not a valid URL string', async () => {
      newCourse.thumbnail = 'invalidURL';
      await expect(new Course(newCourse).validate()).rejects.toThrow();
    });
  });
  /*
  describe('Course middleware', () => {
    let newCourse;
    beforeEach(() => {
      newCourse = {
        title: 'How to play chess',
        facilitator: Types.ObjectId(),
        category: 'Chess',
        description: 'Teaches the basics of chess: how to move pieces and how to checkmate',
        difficulty: 'beginner',
        duration: 1,
        thumbnail: 'https://www.svgrepo.com/show/42988/online-course.svg',
      };
    });

    test('should update rating on save with reviews', () => {
      newCourse.reviews = [{ _id: Types.ObjectId(), author: Types.ObjectId(), comment: 'this is a review', rating: 4 }];
      const course = new Course(newCourse).lean();
      expect(course.rating).toBeCloseTo(4);
    });
  });
  */
});
