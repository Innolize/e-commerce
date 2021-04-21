import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { ICategory } from "../../types";

export default function useEditcategory(
  successCallBack?: Function,
  errorCallback?: Function
) {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/category/`, values)
        .then((res: AxiosResponse<ICategory>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            if (error.response.status === 422) {
              throw new Error(error.response.data.errors[0]);
            } else {
              throw new Error(error.response.data);
            }
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: (category: ICategory) => {
        queryClient.invalidateQueries("categories");
        successCallBack && successCallBack();
      },
      onError: (e: AxiosError) => {
        console.log(e);
        errorCallback && errorCallback();
      },
    }
  );
}
