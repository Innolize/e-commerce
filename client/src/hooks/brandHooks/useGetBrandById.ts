import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../services/api";
import { IBrand } from "../../types";

export default function useGetBrandById(brandId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["brands", brandId],
    () =>
      api
        .get(`/api/brand/findById/${brandId}`)
        .then((res: AxiosResponse<IBrand>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.error);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      initialData: () => {
        return queryClient
          .getQueryData<any>("brands")
          ?.find((b: any) => b.id === parseInt(brandId));
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}
