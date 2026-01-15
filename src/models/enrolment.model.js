const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const contentProgress = mongoose.Schema({
  contentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const quizAnswerSchema = mongoose.Schema({
  questionId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  answer: {
    type: String,
    trim: true,
    maxLength: 200,
    optional: true,
  },
});

const quizAttempt = mongoose.Schema({
  quizId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  totalNoOfQuestions: {
    type: Number,
    min: 1,
    required: true,
  },
  noOfQuestionsAnswered: {
    type: Number,
    min: 1,
    required: true,
  },
  answers: [quizAnswerSchema],
});

const moduleProgress = mongoose.Schema({
  moduleId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  contentCompleted: [contentProgress],
  quizAttempts: [quizAttempt],
});

const enrolmentSchema = mongoose.Schema({
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: new Date(),
  },
  completedAt: {
    type: Date,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  courseProgress: [moduleProgress],
  status: {
    type: String,
    default: 'enrolled',
    enum: ['enrolled', 'completed'],
  },
});

enrolmentSchema.plugin(toJSON);
enrolmentSchema.plugin(paginate);

const Enrolment = mongoose.model('Enrolment', enrolmentSchema);
module.exports = Enrolment;
