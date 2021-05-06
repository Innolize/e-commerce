import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { IBrand } from "../../types";

export default function useCreateBrand(
  successCallBack?: Function,
  errorCallback?: Function
) {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .post("/api/brand", values)
        .then((res: AxiosResponse<IBrand>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            console.log(error.response);
            // The request was made and the server responded with a status code
            throw new Error(error.response.data.errors[0]);
          } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries("brands");
        successCallBack && successCallBack();
      },
      onError: (e: AxiosError) => {
        console.error(e);
        errorCallback && errorCallback();
      },
    }
  );
}
