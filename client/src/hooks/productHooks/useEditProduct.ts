import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { IProduct } from "../../types";

export default function useEditProduct(
  successCallBack?: Function,
  errorCallback?: Function
) {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/product/`, values)
        .then((res: AxiosResponse<IProduct>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.errors[0]);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: (product: IProduct) => {
        queryClient.invalidateQueries("products");
        successCallBack && successCallBack();
      },
      onError: (e: AxiosError) => {
        console.log(e);
        errorCallback && errorCallback();
      },
    }
  );
}
