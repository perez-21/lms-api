const mongoose = require('mongoose');
const { badgeSchema } = require('.');
const { toJSON, paginate } = require('./plugins');

const statsSchema = mongoose.Schema({
  _id: false,
  xp: {
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    weekly: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthly: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  completedCourses: {
    type: Number,
    default: 0,
    min: 0,
  },
  streak: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const studentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  stats: statsSchema,
  completedBadges: [badgeSchema],
});

// add plugin that converts mongoose to json
studentSchema.plugin(toJSON);
studentSchema.plugin(paginate);

/**
 * @typedef Student
 */
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
