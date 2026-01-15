const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { toJSON, paginate } = require('./plugins');

const questionSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 400,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ['multiple-choice', 'short-answer'],
  },
  options: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
  answer: {
    type: String,
    maxLength: 200,
  },
});

const quizSchema = mongoose.Schema({
  questions: {
    type: [questionSchema],
  },
});

const contentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ['video', 'audio', 'text', 'interactive'],
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
});

const moduleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  description: {
    type: String,
    maxLength: 500,
  },
  content: [contentSchema],
  quiz: [quizSchema],
});
const reviewSchema = mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  comment: {
    type: String,
    maxLength: 500,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
});

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  facilitator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facilitator',
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxLength: 100,
  },
  status: {
    type: String,
    default: 'draft',
    trim: true,
    lowercase: true,
    enum: ['published', 'draft', 'archived'],
  },
  description: {
    type: String,
    required: true,
    maxLength: 10000,
  },
  modules: [moduleSchema],
  difficulty: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  duration: {
    // in weeks
    type: Number,
    required: true,
    min: 1,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: isURL,
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  reviews: {
    type: [reviewSchema],
    select: false,
  },
});

courseSchema.pre('save', function () {
  if (this.reviews === 0) {
    return;
  }
  const rating = this.reviews.reduce((acc, curr) => acc + curr, 0) / this.reviews.length;
  this.rating = rating;
});

courseSchema.plugin(toJSON);
courseSchema.plugin(paginate);

/**
 * @typedef Course
 */
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
