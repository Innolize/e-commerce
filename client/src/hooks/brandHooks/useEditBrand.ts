import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "react-query";
import api from "../../services/api";
import { IBrand } from "../../types";

export default function useEditBrand() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: FormData) =>
      api
        .put(`/api/brand/`, values)
        .then((res: AxiosResponse<IBrand>) => res.data)
        .catch((error: AxiosError) => {
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }),
    {
      retry: false,
      onSuccess: (brand: IBrand) => {
        queryClient.invalidateQueries("brands");
      },
      onError: (e: AxiosError) => {
        console.log(e);
        queryClient.invalidateQueries("brands");
      },
    }
  );
}
