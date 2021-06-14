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
