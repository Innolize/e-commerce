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
      onSettled: (newBrand) => {
        queryClient.setQueryData("brands", (previousBrands: any) => [
          ...previousBrands,
          newBrand,
        ]);
        queryClient.invalidateQueries("brands");
      },
      onError: (e: Error) => {
        console.error(e);
        queryClient.invalidateQueries("brands");
      },
    }
  );
}
