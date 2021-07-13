import camelcaseKeys from "camelcase-keys";
import { IServerUserResponse, IUser } from "src/types";

const userMapper = (serverResponse: IServerUserResponse): IUser => {
  const camelCaseResponse = camelcaseKeys(serverResponse, { deep: true });
  return { userInfo: camelCaseResponse.user, accessToken: camelCaseResponse.accessToken };
};

export default userMapper;
