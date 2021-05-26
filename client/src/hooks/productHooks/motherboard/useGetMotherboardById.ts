import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../../services/api";
import { IMotherboard } from "../../../types";

export default function useGetProductId(productId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["motherboards", productId],
    () =>
      api
        .get(`/api/motherboard/${productId}`)
        .then((res: AxiosResponse<IMotherboard>) => res.data)
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
          .getQueryData<any>("motherboards")
          ?.find((b: any) => b.id === parseInt(productId));
      },
      onError: (e: AxiosError) => {
        console.log(e.message);
      },
    }
  );
}
