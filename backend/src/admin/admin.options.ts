import { AdminJSOptions } from 'adminjs';
import ProfessorResource from './resources/users/professor.resource';
import StudentResource from './resources/users/student.resource';
import UserResource from './resources/users/user.resource';
import ChallengeResource from './resources/challenges/challenge.resource';
import ChallengeCodeResource from './resources/challenges/challenge_code.resource';
import ChallengeAliveResource from './resources/challenges/challenge_alive.resource';
import ClassroomResource from './resources/classrooms/classroom.resource';
import MaintenanceResource from './resources/siteStatus/maintenance.resource';
import CourseResource from './resources/courses/course.resource';
import IoTProjectResource from './resources/iot/iotProject.resource';
import IoTObjectResource from './resources/iot/iotObject.resource';

export type AdminParent =
  | {
      name?: string;
      icon?: string;
    }
  | string;

export const adminOptions: AdminJSOptions = {
  rootPath: '/api/admin',
  loginPath: '/api/admin/login',
  logoutPath: '/api/admin/logout',
  resources: [
    UserResource,
    StudentResource,
    ProfessorResource,
    ChallengeResource,
    ChallengeCodeResource,
    ChallengeAliveResource,
    ClassroomResource,
    CourseResource,
    IoTProjectResource,
    IoTObjectResource,
    MaintenanceResource,
  ],
  branding: {
    companyName: 'ALIVEcode',
  },
};
