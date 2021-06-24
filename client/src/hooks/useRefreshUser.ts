import { AxiosResponse } from "axios";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import { useMutation } from "react-query";
import api from "src/services/api";
import { IUserResponse } from "src/types";

export default function useRefreshUser() {
  const { setUser } = useContext(UserContext);

  return useMutation(() => api.post("api/auth/refresh").then((res: AxiosResponse<IUserResponse>) => res.data), {
    retry: false,
    onSuccess: (user) => {
      setUser(user);
    },
  });
}
