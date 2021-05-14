import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { ICategory } from "../../types";

export default function useEditcategory() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/category/`, values)
        .then((res: AxiosResponse<ICategory>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSettled: () => {
        queryClient.invalidateQueries("categories");
      },
      onError: (e: AxiosError) => {
        console.log(e);
        queryClient.invalidateQueries("categories");
      },
    }
  );
}
