import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IProduct } from "../../../types";

export default function useCreateMotherboard() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/motherboard", values)
        .then((res: AxiosResponse<IProduct>) => res.data)
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
        queryClient.invalidateQueries("products");
      },
      onError: (e: AxiosError) => {
        console.error(e);
        queryClient.invalidateQueries("products");
      },
    }
  );
}
