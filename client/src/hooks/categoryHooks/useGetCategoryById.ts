import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "react-query";
import api from "../../services/api";
import { ICategory } from "../../types";

export default function useGetCategoryById(categoryId: string) {
  const queryClient = useQueryClient();
  return useQuery(
    ["categories", categoryId],
    () =>
      api
        .get(`/api/category/${categoryId}`)
        .then((res: AxiosResponse<ICategory>) => res.data)
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
          .getQueryData<any>("categories")
          ?.find((b: any) => b.id === parseInt(categoryId));
      },
      onError: (e: AxiosError) => {
        console.log(e);
      },
    }
  );
}