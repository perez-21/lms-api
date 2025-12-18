const mongoose = require('mongoose');
const { Student } = require('../../../src/models');

describe('Student model', () => {
  describe('Student validation', () => {
    let newStudent;
    beforeEach(() => {
      newStudent = {
        user: mongoose.Types.ObjectId(),
      };
    });

    test('should correctly validate a valid student', async () => {
      await expect(new Student(newStudent).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if student id is not a valid object id', async () => {
      newStudent.user = 'invalidId';
      await expect(new Student(newStudent).validate()).rejects.toThrow();
    });
  });
});
