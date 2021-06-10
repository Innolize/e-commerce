import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IPowerSupply, ServerError } from "../../../types";

export default function useCreatePowerSupply() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/power-supply", values)
        .then((res: AxiosResponse<IPowerSupply>) => res.data)
        .catch((error: AxiosError<ServerError>) => {
          if (error.response) {
            if (error.response.data.errors) {
              throw new Error(Object.values(error.response.data.errors[0])[0]);
            } else {
              throw new Error(error.response.data.message);
            }
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries("power_supplies");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("power_supplies");
      },
    }
  );
}
