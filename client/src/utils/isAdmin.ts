import { IUser } from "src/types";

export const isAdmin = (user?: IUser): boolean => {
  if (user) {
    return user.userInfo.roleId === 1;
  }
  return false;
};
