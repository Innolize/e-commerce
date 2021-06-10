import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IRam, ServerError } from "../../../types";

export default function useCreateRam() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/ram", values)
        .then((res: AxiosResponse<IRam>) => res.data)
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
        queryClient.invalidateQueries("rams");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("rams");
      },
    }
  );
}
