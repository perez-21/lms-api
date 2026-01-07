const Permissions = require('./permissions');

const allRoles = {
  student: [],
  facilitator: [],
  admin: [
    Permissions.USER_READ,
    Permissions.USER_CREATE,
    Permissions.USER_UPDATE,
    Permissions.USER_DELETE,
    Permissions.STUDENT_CREATE,
    Permissions.STUDENT_READ,
    Permissions.STUDENT_UPDATE,
    Permissions.STUDENT_DELETE,
    Permissions.COURSE_CREATE,
    Permissions.COURSE_READ,
    Permissions.COURSE_DELETE,
    Permissions.COURSE_UPDATE,
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
