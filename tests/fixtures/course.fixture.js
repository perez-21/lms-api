const mongoose = require('mongoose');
const { Course } = require('../../src/models');
const { facilitatorOne, facilitatorTwo } = require('./facilitator.fixture');

const courseOne = {
  _id: mongoose.Types.ObjectId(),
  facilitator: facilitatorOne._id,
  title: 'How to play chess',
  category: 'Chess',
  description: 'Teaches the basics of chess: how to move pieces and how to checkmate',
  difficulty: 'beginner',
  duration: 1,
  thumbnail: 'https://www.svgrepo.com/show/42988/online-course.svg',
};

const courseTwo = {
  _id: mongoose.Types.ObjectId(),
  facilitator: facilitatorOne._id,
  title: 'Intermediate Chess Tactics',
  category: 'Chess',
  description: 'Covers tactical patterns such as forks, pins, skewers, and discovered attacks.',
  difficulty: 'intermediate',
  duration: 3,
  thumbnail: 'https://www.svgrepo.com/show/42988/online-course.svg',
};

const courseThree = {
  _id: mongoose.Types.ObjectId(),
  facilitator: facilitatorTwo._id,
  title: 'Advanced Endgame Strategies',
  category: 'Chess',
  description: 'Focuses on complex endgame positions, calculation techniques, and conversion strategies.',
  difficulty: 'advanced',
  duration: 4,
  thumbnail: 'https://www.svgrepo.com/show/42988/online-course.svg',
};

const insertCourses = async (facilitators) => {
  await Course.insertMany(facilitators);
};

module.exports = {
  courseOne,
  courseTwo,
  courseThree,
  insertCourses,
};
