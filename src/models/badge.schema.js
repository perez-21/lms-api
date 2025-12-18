const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema({
  _id: false,
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  earnedAt: {
    type: Date,
  },
});

module.exports = badgeSchema;
