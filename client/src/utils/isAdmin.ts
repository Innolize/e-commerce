import { IUserResponse } from "src/types";

export const isAdmin = (user?: IUserResponse): boolean => {
  if (user) {
    return user.user.role_id === 1;
  }
  return false;
};
