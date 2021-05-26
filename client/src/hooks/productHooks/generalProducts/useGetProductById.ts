import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IProduct } from "../../../types";

export default function useGetProductById(productId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["products", productId],
    () =>
      api
        .get(`/api/product/${productId}`)
        .then((res: AxiosResponse<IProduct>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      initialData: () => {
        return queryClient
          .getQueryData<any>("products")
          ?.find((b: any) => b.id === parseInt(productId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
