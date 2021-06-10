import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IProduct, ServerError } from "../../../types";

export default function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/product", values)
        .then((res: AxiosResponse<IProduct>) => res.data)
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
      onSuccess: (newProduct) => {
        queryClient.setQueryData("products", (previousProduct: any) => [
          ...previousProduct,
          newProduct,
        ]);
        queryClient.invalidateQueries("products");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("products");
      },
    }
  );
}
