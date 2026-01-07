const mongoose = require('mongoose');
const { Facilitator } = require('../../src/models');
const { userOne, userTwo } = require('./user.fixture');

const facilitatorOne = {
  _id: mongoose.Types.ObjectId(),
  user: userOne._id,
};

const facilitatorTwo = {
  _id: mongoose.Types.ObjectId(),
  user: userTwo._id,
};

const insertFacilitators = async (facilitators) => {
  await Facilitator.insertMany(facilitators);
};

module.exports = {
  facilitatorOne,
  facilitatorTwo,
  insertFacilitators,
};
