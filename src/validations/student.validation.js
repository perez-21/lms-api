const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudent = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const getStudents = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getStudent = {
  params: Joi.object().keys({
    studentId: Joi.string().custom(objectId),
  }),
};

const updateStudent = {
  params: Joi.object().keys({
    studentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      stats: Joi.object().optional(),
      completedBadges: Joi.array().optional(),
    })
    .min(1),
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
};
