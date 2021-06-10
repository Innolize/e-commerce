import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IMotherboard, ServerError } from "../../../types";

export default function useEditMotherboard() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/motherboard/`, values)
        .then((res: AxiosResponse<IMotherboard>) => res.data)
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
        queryClient.invalidateQueries("motherboards");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
