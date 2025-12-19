const mongoose = require('mongoose');
const { Facilitator } = require('../../../src/models');

describe('Facilitator Model', () => {
  describe('Student Validation', () => {
    let newFacilitator;
    beforeEach(() => {
      newFacilitator = { user: mongoose.Types.ObjectId() };
    });

    test('should correctly validate a facilitator if data is ok', async () => {
      await expect(new Facilitator(newFacilitator).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if facilitator id is not a valid object id', async () => {
      newFacilitator.user = 'invalidId';
      await expect(new Facilitator(newFacilitator).validate()).rejects.toThrow();
    });
  });
});
