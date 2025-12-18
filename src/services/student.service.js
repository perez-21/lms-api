const httpStatus = require('http-status');
const { Student } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a student
 * @param {Object} studentBody
 * @returns {Promise<Student>}
 */
const createStudent = async (studentBody) => {
  if (await Student.findOne({ user: studentBody.userId })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  return Student.create({ user: studentBody.userId, ...studentBody });
};

/**
 * Query for students
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStudents = async (filter, options) => {
  const students = await Student.paginate(filter, options);
  return students;
};

/**
 * Get student by id
 * @param {ObjectId} id
 * @returns {Promise<Student>}
 */
const getStudentById = async (studentId) => {
  return Student.findById(studentId).populate('user');
};

/**
 * Update student by id
 * @param {ObjectId} studentId
 * @param {Object} updateBody
 * @returns {Promise<Student>}
 */
const updateStudentById = async (studentId, updateBody) => {
  if (!(await Student.exists({ _id: studentId }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  await Student.updateOne({ _id: studentId }, updateBody);
  const student = await Student.findById(studentId);
  return student;
};

module.exports = {
  createStudent,
  queryStudents,
  getStudentById,
  updateStudentById,
};
