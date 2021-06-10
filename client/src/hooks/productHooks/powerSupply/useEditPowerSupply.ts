import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IPowerSupply } from "src/types";
import api from "../../../services/api";

export default function useEditPowerSupply() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/power-supply/`, values)
        .then((res: AxiosResponse<IPowerSupply>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
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
        console.log(e);
      },
    }
  );
}
