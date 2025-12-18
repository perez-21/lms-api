const mongoose = require('mongoose');
const { Student } = require('../../src/models');
const { userOne, userTwo } = require('./user.fixture');

const studentOne = {
  _id: mongoose.Types.ObjectId(),
  user: userOne._id,
  completedBadges: [{ title: 'Badge 1', description: 'badge description', earnedAt: new Date() }],
};

const studentTwo = {
  _id: mongoose.Types.ObjectId(),
  user: userTwo._id,
  completedBadges: [{ title: 'Badge 2', description: 'badge description', earnedAt: new Date() }],
};

const insertStudents = async (students) => {
  await Student.insertMany(students);
};

module.exports = {
  studentOne,
  studentTwo,
  insertStudents,
};
