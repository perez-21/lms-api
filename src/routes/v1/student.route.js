const express = require('express');

const { studentController } = require('../../controllers');
const { studentValidation } = require('../../validations');
const Permissions = require('../../config/permissions');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(Permissions.STUDENT_CREATE), validate(studentValidation.createStudent), studentController.createStudent)
  .get(auth(Permissions.STUDENT_READ), validate(studentValidation.getStudents), studentController.getStudents);

router
  .route('/:studentId')
  .get(auth(Permissions.STUDENT_READ), validate(studentValidation.getStudent), studentController.getStudent)
  .patch(auth(Permissions.STUDENT_UPDATE), validate(studentValidation.updateStudent), studentController.updateStudent);

module.exports = router;
