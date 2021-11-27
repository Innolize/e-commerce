import { AxiosResponse } from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/contexts/UserContext";
import api from "src/services/api";
import { IServerUserResponse } from "src/types";
import userMapper from "src/utils/userMapper";

export default function useRefreshUser() {
  const { setUser } = useContext(UserContext);

  return useMutation(
    () =>
      api.post("api/auth/refresh").then((res: AxiosResponse<IServerUserResponse>) => {
        return userMapper(res.data);
      }),
    {
      retry: false,
      onSuccess: (user) => {
        localStorage.setItem("token", user.accessToken);
        setUser(user);
      },
    }
  );
}
