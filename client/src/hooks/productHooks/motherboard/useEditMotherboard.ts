import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../../services/api";
import { IProduct } from "../../../types";

export default function useEditProduct() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/motherboard/`, values)
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
      onSuccess: (product: IProduct) => {
        queryClient.invalidateQueries("motherboards");
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
