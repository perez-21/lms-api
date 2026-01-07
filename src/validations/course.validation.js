const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCourse = {
  body: Joi.object().keys({
    facilitatorId: Joi.string().required().custom(objectId),
    title: Joi.string().required(),
    category: Joi.string().required().lowercase(),
    status: Joi.string().lowercase(),
    description: Joi.string().required(),
    difficulty: Joi.string().required().lowercase(),
    duration: Joi.number().required().integer().positive(),
    rating: Joi.forbidden(),
    thumbnail: Joi.string().uri(),
  }),
};

const getCourses = {
  query: Joi.object().keys({
    title: Joi.string(),
    category: Joi.string(),
    status: Joi.string(),
    difficulty: Joi.string(),
    rating: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const deleteCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
};

const updateCourse = {
  params: Joi.object().keys({
    courseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      facilitatorId: Joi.forbidden(),
      title: Joi.string().optional(),
      category: Joi.string().lowercase().optional(),
      status: Joi.string().lowercase().optional(),
      description: Joi.string().optional(),
      difficulty: Joi.string().lowercase().optional(),
      duration: Joi.number().integer().positive().optional(),
      rating: Joi.forbidden(),
      thumbnail: Joi.string().uri().optional(),
    })
    .min(1),
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
