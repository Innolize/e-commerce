import { AxiosError, AxiosResponse } from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/contexts/UserContext";
import api from "src/services/api";
import { IServerUserResponse, ServerError } from "src/types";
import userMapper from "src/utils/userMapper";

interface ICreateUserData {
  mail: string;
  password: string;
}

export default function useCreateUser() {
  const { setUser } = useContext(UserContext);

  return useMutation(
    (values: ICreateUserData) =>
      api
        .post("api/auth/signup", values)
        .then((res: AxiosResponse<IServerUserResponse>) => {
          return userMapper(res.data);
        })
        .catch((error: AxiosError<ServerError | string>) => {
          if (error.response) {
            if (typeof error.response.data === "string") {
              throw new Error(error.response.data);
            }
            if (error.response.data.errors) {
              throw new Error(Object.values(error.response.data.errors[0])[0]);
            }
            throw error.response;
          } else {
            throw new Error(error.message);
          }
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
