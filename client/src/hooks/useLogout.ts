import { AxiosResponse } from "axios";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import { useMutation } from "react-query";
import api from "src/services/api";

export default function useLogoutUser() {
  const { setUser } = useContext(UserContext);

  return useMutation(() => api.post("api/auth/logout").then((res: AxiosResponse) => res.data), {
    retry: false,
    onSuccess: () => {
      setUser();
    },
  });
}
