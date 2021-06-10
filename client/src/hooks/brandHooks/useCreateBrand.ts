import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { IBrand, ServerError } from "../../types";

export default function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/brand", values)
        .then((res: AxiosResponse<IBrand>) => res.data)
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
      onSettled: (newBrand) => {
        queryClient.setQueryData("brands", (previousBrands: any) => [
          ...previousBrands,
          newBrand,
        ]);
        queryClient.invalidateQueries("brands");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("brands");
      },
    }
  );
}
