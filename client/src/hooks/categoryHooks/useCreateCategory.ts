import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { ICategory } from "../../types";

export default function useCreateCategory(
  successCallBack?: Function,
  errorCallback?: Function
) {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/category", values)
        .then((res: AxiosResponse<ICategory>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            if (error.response.status === 422) {
              throw new Error(error.response.data.errors[0]);
            } else {
              throw new Error(error.response.data);
            }
          } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        successCallBack && successCallBack();
      },
      onError: (e: AxiosError) => {
        console.error(e);
        errorCallback && errorCallback();
      },
    }
  );
}
