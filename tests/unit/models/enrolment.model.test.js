const { Types } = require('mongoose');
const { Enrolment } = require('../../../src/models');

describe('Enrolment Model', () => {
  describe('Enrolment Validation', () => {
    let newEnrolment;
    beforeEach(() => {
      newEnrolment = {
        student: Types.ObjectId(),
        course: Types.ObjectId(),
      };
    });

    test('should correctly validate a valid course', async () => {
      await expect(new Enrolment(newEnrolment).validate()).resolves.toBeUndefined();
    });

    test('should throw an error if studentId is invalid', async () => {
      newEnrolment.student = 'invalidId';
      await expect(new Enrolment(newEnrolment).validate()).rejects.toThrow();
    });

    test('should throw an error if courseId is invalid', async () => {
      newEnrolment.course = 'invalidId';
      await expect(new Enrolment(newEnrolment).validate()).rejects.toThrow();
    });
  });
});
