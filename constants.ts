import { UserRole } from "@prisma/client";

interface IPathName {
  [key: string]: {
    path: string;
    roles: UserRole[];
    requireToken: boolean;
  };
}

const pathName: IPathName = {
  login: {
    path: "/signin",
    roles: [],
    requireToken: false
  },
  home: {
    path: "/",
    roles: [],
    requireToken: false
  },
  dashboard: {
    path: "/dashboard",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  register: {
    path: "/register",
    roles: [],
    requireToken: false
  },
  profile: {
    path: "/profile",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  settings: {
    path: "/settings",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  admin: {
    path: "/admin",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  userApi: {
    path: "/api/user",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  quiz: {
    path: "/admin/quiz",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  questions: {
    path: "/admin/questions",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  quizAdd: {
    path: "/admin/quiz/add",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  questionsAdd: {
    path: "/admin/questions/add",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  questionSetApi: {
    path: "/api/questionset",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  questionsApiPath:{
    path: "/api/questions",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  updateProfileApi: {
    path: "/api/updateProfile",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  testSetApis: {
    path: "/api/quiz",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  quizAnsApi: {
    path: "/api/quiz/submission",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  notificationApi: {
    path: "/api/notification",
    roles: [UserRole.ADMIN, UserRole.USER],
    requireToken: true
  },
  adminReportsRoute: {
    path: "/admin/reports",
    roles: [],
    requireToken: false
  },
  adminReportApiRoute: {
    path: "/api/quiz/adminReport",
    roles: [],
    requireToken: false
  },
  userQuizResponseApiRoute: {
    path: "/api/quiz/userResponse",
    roles: [],
    requireToken: false
  },

  marksApiRoute: {
    path: "/api/quiz/marksSubmission",
    roles: [],
    requireToken: false
  },

  quizReportApiRoute: {
    path: "/api/quiz/quizReport",
    roles: [],
    requireToken: false
  },
  subscriptionApiRoute: {
    path: "/api/quiz/subscription",
    roles: [],
    requireToken: false
  }
  
};

export default pathName;
