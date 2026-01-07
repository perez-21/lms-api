const { Router } = require('express');
const { courseController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { courseValidation } = require('../../validations');
const Permissions = require('../../config/permissions');

const router = Router();

router
  .route('/')
  .post(validate(courseValidation.createCourse), auth(Permissions.COURSE_CREATE), courseController.createCourse)
  .get(validate(courseValidation.getCourses), auth(Permissions.COURSE_READ), courseController.getCourses);

router
  .route('/:courseId')
  .get(validate(courseValidation.getCourse), auth(Permissions.COURSE_READ), courseController.getCourse)
  .patch(validate(courseValidation.updateCourse), auth(Permissions.COURSE_UPDATE), courseController.updateCourse)
  .delete(validate(courseValidation.deleteCourse), auth(Permissions.COURSE_DELETE), courseController.deleteCourse);

module.exports = router;
