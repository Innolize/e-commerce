import { AxiosResponse } from "axios";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import { useMutation, useQueryClient } from "react-query";
import api from "src/services/api";
import { useSnackbar } from "notistack";

export default function useLogoutUser() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useContext(UserContext);

  return useMutation(() => api.post("api/auth/logout").then((res: AxiosResponse) => res.data), {
    retry: false,
    onSuccess: () => {
      // We remove the user the jwt and the cart.
      setUser();
      localStorage.removeItem("token");
      queryClient.removeQueries("cart");
      enqueueSnackbar("You've been logged out.", { variant: "info" });
    },
    onError: () => {
      enqueueSnackbar("Logout error", { variant: "error" });
    },
  });
}
