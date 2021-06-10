import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IProduct, ServerError } from "../../../types";

export default function useCreateMotherboard() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/motherboard", values)
        .then((res: AxiosResponse<IProduct>) => res.data)
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
        queryClient.invalidateQueries("motherboards");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("motherboards");
      },
    }
  );
}
