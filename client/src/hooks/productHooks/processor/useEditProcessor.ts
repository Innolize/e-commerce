import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import { IProcessor } from "src/types";
import api from "../../../services/api";

export default function useEditProcessor() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/processor/`, values)
        .then((res: AxiosResponse<IProcessor>) => res.data)
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
        queryClient.invalidateQueries("processors");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
