import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IMotherboard } from "../../../types";

export default function useEditMotherboard() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/motherboard/`, values)
        .then((res: AxiosResponse<IMotherboard>) => res.data)
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
        queryClient.invalidateQueries("motherboards");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
