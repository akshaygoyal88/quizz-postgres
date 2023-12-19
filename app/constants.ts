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
  }
};

export default pathName;
