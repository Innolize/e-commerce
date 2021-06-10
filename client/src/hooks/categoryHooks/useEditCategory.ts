import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { ICategory, ServerError } from "../../types";

export default function useEditcategory() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/category/`, values)
        .then((res: AxiosResponse<ICategory>) => res.data)
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